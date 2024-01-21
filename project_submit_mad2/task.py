from celery import shared_task 
import time
from models_grocery_login import *
import csv,json
from json import dumps
from httplib2 import Http
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from email.mime.application import MIMEApplication
import pdfkit
from datetime import datetime,date,timedelta
from sqlalchemy.exc import IntegrityError

SMTP_SERVER_HOST="smtp.gmail.com"
SMTP_SERVER_PORT=587
SENDER_EMAIL="fayyazhm@gmail.com"
SENDER_PASSWORD="tfyf cnlo xgug leai"


@shared_task(ignore_result=False)
def product_csv_cel():
    time.sleep(10)
    products=Product.query.order_by(desc(Product.product_quantity)).all()
    category=Category.query.all()
    order=Order.query.all()
    cat={}
    sold={}
    
    for i in products:
        sold[i.product_id]=0

    for i in order:
        sold[i.order_productid]+=i.order_qty
    
    for i in category:
        if i not in cat:
            cat[i.category_id]=0
        cat[i.category_id]=i.category_name
    with open("static/products.csv","w") as new_file:
        fieldnames=['product_id','product_name','product_quantity_available',"product_quantity_sold",'product_manufacture','product_expirydate','product_category',"category_id","product_rate"]
        csv_writer=csv.DictWriter(new_file,fieldnames=fieldnames)
        csv_writer.writeheader()
        for i in products:
            csv_writer.writerow({"product_id":i.product_id,"product_name":i.product_name,"product_quantity_available":i.product_quantity,"product_manufacture":i.product_manufacture,"product_expirydate":i.product_expirydate,
                                 "product_category":cat[i.product_category],"product_quantity_sold":sold[i.product_id],"category_id":i.product_category,"product_rate":i.product_rate})



@shared_task(ignore_result=False)
def add_product_csv_cel(v,q):
    failed={"category_absent":[],"product_already":[]}
    with open(f"static/{v}",'r') as new_file:
        csv_reader=csv.DictReader(new_file)
        for line in csv_reader:
            if Product.query.filter(and_(Product.product_name==line["product_name"]),(Product.product_category==line["category_id"])).first()==None:    
                if Category.query.filter(Category.category_id==line["category_id"]).first()!=None:
                    [a,b,c]=line["product_expirydate"].split('-')
                    exp_date=date(int(a),int(b),int(c))
                    new_product=Product(product_name=line["product_name"],product_quantity=line["product_quantity_available"],product_rate=line["product_rate"],product_manufacture=line["product_manufacture"],
                                product_expirydate=exp_date,product_category=line["category_id"])
                    db.session.add(new_product)
                else:
                    failed["category_absent"].append(line)
            else:
                failed["product_already"].append(line)
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
        finally:
            new_task=Tasks(task_name=v,result=failed,user_id=q)
            db.session.add(new_task)
            db.session.commit()



@shared_task(ignore_result=False)
def chat_notification():
    url = "https://chat.googleapis.com/v1/spaces/AAAACciilfo/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=edhN2tmYew4hY3BYiX0NuypA7SesMR1YsArjB8MvEwQ"
    app_message = {
        'text': 'We find you missing:( please do visit grocery store app for buying your essentials at great offers :)'}
    message_headers = {'Content-Type': 'application/json; charset=UTF-8'}
    http_obj = Http()
    response = http_obj.request(
        uri=url,
        method='POST',
        headers=message_headers,
        body=dumps(app_message),
    )


@shared_task(ignore_result=False)
def send_mail(to,subject,message_body,attachment_paths):
    time.sleep(10)
    msg=MIMEMultipart()
    msg["To"]=to
    msg["From"]=SENDER_EMAIL
    msg["Subject"]=subject

    msg.attach(MIMEText(message_body,"html"))
    for a in attachment_paths:
        with open(a, "rb") as attachment_file:
            part = MIMEApplication(attachment_file.read(), Name=a)
            msg.attach(part)
    server=smtplib.SMTP(host=SMTP_SERVER_HOST,port=SMTP_SERVER_PORT)
    server.starttls()
    server.login(user=SENDER_EMAIL,password=SENDER_PASSWORD)
    server.send_message(msg)
    server.quit()


def categ_summary():
    catq=Category.query.all()
    catl=[]
    for i in catq:
        catl.append(i.category_id)
    prodl={}
    totl={}
    proda={}
    ordl={}
    prod=Product.query.all()

    for i in catl:
        prodl[i]=[]
        totl[i]=0
        proda[i]=0   
    for i in prod:
        prodl[i.product_category].append(i.product_id)
        proda[i.product_category]+=i.product_quantity
    sora=[]
    for i in proda:
        sora.append(proda[i])
    sora.sort(reverse=True)

    sorc=[]
    
    for i in sora:
        for c in proda:
            if proda[c]==i:
                sorc.append(c)
    
    cat=[]
    for i in sorc:
        for c in catq:
            if i==c.category_id:
                cat.append(c)
    ord=Order.query.all()
    for i in ord:
        if i.order_productid not in ordl:
            ordl[i.order_productid]=i.order_qty
        else:
            ordl[i.order_productid]+=i.order_qty
    for i in ordl:
        for c in prodl:
            if i in prodl[c]:
                totl[c]+=ordl[i]
    category_summary=render_template("category_summary.html",catl=catl,prodl=prodl,cat=cat,totl=totl,proda=proda)
    options = {
                    'page-size': 'A4',
                    'orientation': 'Portrait',
                    'margin-top': '0mm',
                    'margin-right': '0mm',
                    'margin-bottom': '0mm',
                    'margin-left': '0mm',
                }
    pdfkit.from_string(category_summary,"category_summary.pdf", options=options)

def prod_summary():
    prod=Product.query.order_by(desc(Product.product_quantity)).all()
    ordl={}
    total_aqty=0
    for i in prod:
        ordl[i.product_id]=0
        total_aqty+=i.product_quantity
    ord=Order.query.all()
    total_pqty=0
    for i in ord:
        ordl[i.order_productid]+=i.order_qty
        total_pqty+=i.order_qty

    product_summary=render_template('product_summary.html',prod=prod,ordl=ordl,dat=date.today(),total_pqty=total_pqty,total_aqty=total_aqty,cat='cat')
    pdfkit.from_string(product_summary,"product_summary.pdf")

def ord_summary():
    tot=Total.query.all()
    total=0
    for i in tot:
        total+=i.total_orderamount
    ord=Order.query.all()
    user=Users.query.all()
    name={}        
    for i in ord:
        name[i.order_number]=Users.query.filter_by(id=i.order_userid).first().username
    
    order_summary=render_template('order_summary.html',tot=tot,name=name,total=total)
    pdfkit.from_string(order_summary,"order_summary.pdf")

@shared_task(ignore_result=False)
def admin_summary_reports():
    categ_summary()
    prod_summary()
    ord_summary()
    files=["product_summary.pdf","order_summary.pdf","category_summary.pdf"]
    send_mail("fayyazhm@gmail.com","This is the summary report attached as pdf","Please find the attached reports",files)

@shared_task(ignore_result=False)
def buy_notification():
    user=Users.query.filter_by(role="user").all()
    data=[]
    for i in user:
        if i.email !=None:
            if i.last_login != date.today():
                data.append(i)
    a=[]
    for i in data:
        send_mail(i.email,"We find you missing :(","Please do Visit Our Grocery app for buying your daily necessary we have exiting prices",a)
