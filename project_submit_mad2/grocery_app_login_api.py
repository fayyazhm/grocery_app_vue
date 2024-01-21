from flask import Flask,render_template,request,redirect,jsonify,url_for,send_file,render_template_string
from models_grocery_login import *
from datetime import datetime,date,timedelta
from sqlalchemy.exc import IntegrityError
from flask_login import LoginManager,login_user,current_user,login_required,UserMixin,logout_user
from workers import celery_init_app
import task
from celery.result import AsyncResult
from flask_bcrypt import Bcrypt
from celery.schedules import crontab
import pdfkit
import os

app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///grocery_login.sqlite3"
app.config['SECRET_KEY']= "SECRETKEYSECRETKEYSECRETKEY121213121312"
db.init_app(app)
login_manager=LoginManager()
login_manager.init_app(app)
app.app_context().push() 
cel_app=celery_init_app(app)
bcrypt = Bcrypt(app)
#-----------------------------------------admin---------------------------------------------------------------------------------#


@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(user_id)

@app.route("/logout")
@login_required
def user_logout():
    logout_user()
    return render_template('user_logout.html') 


@app.route("/")
def screen():
    return render_template('homepage.html')


@app.route("/admin/home")
@login_required
def admin_home():
    if current_user.role=="admin":
        return render_template('category_present.html')

@app.route("/admin",methods=["GET","POST"])
def admin():
    if request.method=='POST':
        all_values=request.form.to_dict()   
        user=all_values['username']
        password=all_values['password']
        det=Users.query.filter_by(username=user,role='admin').first()
        if det==None:
            return render_template('Invalid_username.html')  
        else:
            if det.password==password:
                login_user(det)
                det.last_login=date.today()
                try:
                    db.session.commit()
                except IntegrityError:
                    db.session.rollback()
                cat=Category.query.all()
                return redirect(url_for('admin_home')) 
            else:
                return render_template('Invalid_username.html')    
    
    return render_template('admin_login.html')

@app.route("/categories",methods=["GET"])
@login_required
def category():
    if request.method=="GET" and current_user.role=="admin" or "store_manager":
        cat=Category.query.all()
        prod=Product.query.order_by(desc(Product.product_id)).all()
        dat={"prod":[],"cat":[]}
        cat_data=[]
        prod_data=[]
        for i in cat:
            cat_data.append({
                "category_id":i.category_id,
                "category_name":i.category_name,
            })
        for i in prod:
            prod_data.append({
                "product_id":i.product_id,
                "product_name":i.product_name,
                "product_quantity":i.product_quantity,
                "product_rate":i.product_rate,
                "product_manufacture":i.product_manufacture,
                "product_expirydate":i.product_expirydate,
                "product_category":i.product_category,
            })
        dat["prod"]=prod_data
        dat["cat"]=cat_data

        return jsonify(dat)
    
@app.route("/add_categories",methods=["POST"])
@login_required
def add_category():
    if request.method=="POST" and current_user.role=="admin":
        data=request.get_json()
        print(data)
        new_category=Category(category_name=data.get("category_name"))
        s=Category.query.filter_by(category_name=data.get("category_name")).all()
        if len(s)!=0:
            return jsonify("category already present")
        try:
            db.session.add(new_category)
            db.session.commit()
            return jsonify("category successfully added")
        except:
            return jsonify("Error in posting")

@app.route("/edit_categories",methods=["POST"])
@login_required
def edit_category():
    if request.method=="POST" and current_user.role=="admin":
        data=request.get_json()
        print(data)
        cat=Category.query.filter_by(category_id=data.get("category_id")).first()
        cat.category_name=data.get("category_name")
        print(cat.category_name)
        try:
            db.session.commit()
            print("success")
            return jsonify("category successfully added")
        
        except IntegrityError:
            print("error")
            db.session.rollback()
            return jsonify("category already present")

@app.route("/category/delete/<int:id>",methods=["GET"])
@login_required
def delete_category(id):
    if request.method=="GET" and current_user.role=="admin":
        cat=Category.query.filter_by(category_id=id).first()
        prod=Product.query.filter_by(product_category=id).all()
        if prod!=[]:
            for i in prod:
                db.session.delete(i)
        db.session.delete(cat)
        try:
            db.session.commit()
            return jsonify("category successfully deleted")
        except IntegrityError:
            db.session.rollback()
            return jsonify("error")


@app.route("/category/<int:id>",methods=["GET"])
@login_required
def get_category(id):
    if request.method=="GET" and current_user.role=="admin" or "store_manager":
        print("inside")
        data=Category.query.filter_by(category_id=id).first()
        dat={"category_id":data.category_id,"category_name":data.category_name}
        return jsonify(dat)
    
@app.route("/add_product",methods=["POST"])
@login_required
def add_product():
    if request.method=="POST" and current_user.role=="admin" or "store_manager":
        data=request.get_json()
        print(data)
        [a,b,c]=data.get("product_expirydate").split('-')
        exp_date=date(int(a),int(b),int(c))
        print(exp_date)
        print(data)
        new_product=Product(product_name=data.get("product_name"),product_quantity=data.get("product_quantity"),product_rate=data.get("product_rate"),product_manufacture=data.get("product_manufacture"),
                            product_expirydate=exp_date,product_category=data.get("product_category"))
        s=Product.query.filter_by(product_name=data.get("product_name")).all()
        print(new_product.product_category,new_product.product_expirydate)
        if len(s)!=0:
            return jsonify("product already present")
        print("db loaded")
        db.session.add(new_product)
        db.session.commit()
        print("db added")            
        return jsonify("product successfully added")
        

@app.route("/edit_product",methods=["POST"])
@login_required
def edit_product():
    if request.method=="POST" and current_user.role=="admin" or "store_manager":
        data=request.get_json()
        print(data)
        [a,b,c]=data.get("product_expirydate").split('-')
        exp_date=date(int(a),int(b),int(c))
        prod=Product.query.filter_by(product_id=data.get("product_id")).first()
        prod.product_name=data.get("product_name")
        prod.product_quantity=data.get("product_quantity")
        prod.product_rate=data.get("product_rate")
        prod.product_expirydate=exp_date
        prod.product_manufacture=data.get("product_manufacture")
        try:
            db.session.commit()
            return jsonify("product successfully edited")
        except:
            return jsonify("product already present")


@app.route("/product/delete/<int:id>",methods=["GET"])
@login_required
def delete_product(id):
    if current_user.role=="admin" or "store_manager":
        prod=Product.query.filter_by(product_id=id).first()
        try:
            db.session.delete(prod)
            db.session.commit()
            return jsonify("product successfully deleted")
                
        except IntegrityError:
            db.session.rollback()
            return jsonify("error")

@app.route("/admin/summary/product",methods=["GET"])
@login_required
def product_summary():
    if current_user.role=='admin':
        product=Product.query.order_by(desc(Product.product_quantity)).all()
        prod_data=[]
        for i in product:
            prod_data.append({
                "product_id":i.product_id,
                "product_name":i.product_name,
                "product_quantity":i.product_quantity,
                "product_rate":i.product_rate,
                "product_manufacture":i.product_manufacture,
                "product_expirydate":i.product_expirydate,
                "product_category":i.product_category,
            })
        ordl={}
        total_aqty=0
        for i in product:
            ordl[i.product_id]=0
            total_aqty+=i.product_quantity
        ord=Order.query.all()
        total_pqty=0
        for i in ord:
            ordl[i.order_productid]+=i.order_qty
            total_pqty+=i.order_qty
        data={"ordl":ordl,"total_aqty":total_aqty,"product":prod_data,"total_pqty":total_pqty,"dat":date.today()}
        return jsonify(data)
        
@app.route("/admin/summary/category",methods=["GET"])
@login_required
def categorysummary():
    if current_user.role=='admin':
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
 
        catu=[]
        for i in sorc:
            for c in catq:
                if i==c.category_id:
                    if c not in catu:
                        catu.append(c)
        print(sorc)                
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
        cat=[]
        for i in catu:
            cat.append({
                "category_id":i.category_id,
                "category_name":i.category_name,
            })

        data={"catl":catl,"prodl":prodl,"cat":cat,"totl":totl,"proda":proda}
         
        return jsonify(data)

@app.route("/admin/summary/category/<int:category_id>",methods=["GET","POST"])
@login_required
def categoryprodsummary(category_id):
    if current_user.role=='admin':
        prod=Product.query.filter_by(product_category=category_id).order_by(desc(Product.product_quantity)).all()
        prod_data=[]
        for i in prod:
            prod_data.append({
                "product_id":i.product_id,
                "product_name":i.product_name,
                "product_quantity":i.product_quantity,
                "product_rate":i.product_rate,
                "product_manufacture":i.product_manufacture,
                "product_expirydate":i.product_expirydate,
                "product_category":i.product_category,
            })
        ordl={}
        total_aqty=0
        for i in prod:
            ordl[i.product_id]=0
            total_aqty+=i.product_quantity
        total_pqty=0
        ord=Order.query.all()
        for i in ord:
            if i.order_productid in ordl:
                ordl[i.order_productid]+=i.order_qty
                total_pqty+=i.order_qty
        catu=Category.query.filter_by(category_id=category_id).first()
        cat={"category_name":catu.category_name,"category_id":catu.category_id}
        data={"ordl":ordl,"total_aqty":total_aqty,"product":prod_data,"total_pqty":total_pqty,"dat":date.today(),"cat":cat}
        return jsonify(data)

@app.route("/admin/summary/order",methods=["GET","POST"])
@login_required
def ordersummary():
    if current_user.role=='admin':
        totu=Total.query.all()
        tot=[]
        for i in totu:
            tot.append({
                "total_ordernumber":i.total_ordernumber,
                "total_orderamount":i.total_orderamount,
                "total_orderaddress":i.total_orderaddress,
                "total_orderaddress2":i.total_orderaddress2,
                "total_ordercity":i.total_ordercity,
                "total_orderstate":i.total_orderstate,
                "total_orderzip":i.total_orderzip,
                "total_orderrating":i.total_orderrating,
                "total_orderdate":i.total_orderdate       
            })
        ord=Order.query.all()
        useru=Users.query.all()
        name={}        
        for i in ord:
            name[i.order_number]=Users.query.filter_by(id=i.order_userid).first().username
        data={"tot":tot,"name":name}
        return jsonify(data)

@app.route("/admin/order/<int:order_number>")
@login_required
def ordernumber(order_number):
    if current_user.role=='admin':
        produ=Product.query.all()
        ordu=Order.query.filter_by(order_number=order_number).all()
        ord=[]
        for i in ordu:
            ord.append({
                "order_number":i.order_number,
                "order_itemnumber":i.order_itemnumber,
                "order_itemprice":i.order_itemprice,
                "order_qty":i.order_qty,
                "order_userid":i.order_userid,
                "order_productid":i.order_productid

            })
        totu=Total.query.filter_by(total_ordernumber=order_number).first()
        tot={   "total_ordernumber":totu.total_ordernumber,
                "total_orderamount":totu.total_orderamount,
                "total_orderaddress":totu.total_orderaddress,
                "total_orderaddress2":totu.total_orderaddress2,
                "total_ordercity":totu.total_ordercity,
                "total_orderstate":totu.total_orderstate,
                "total_orderzip":totu.total_orderzip,
                "total_orderrating":totu.total_orderrating,
                "total_orderdate":totu.total_orderdate,
                }
        name={}
        prod=[]
        for i in produ:
            prod.append({
                "product_id":i.product_id,
                "product_name":i.product_name,
                "product_quantity":i.product_quantity,
                "product_rate":i.product_rate,
                "product_manufacture":i.product_manufacture,
                "product_expirydate":i.product_expirydate,
                "product_category":i.product_category,
            })        
        for i in ordu:
            name[i.order_number]=Users.query.filter_by(id=i.order_userid).first().username
        nam=name[order_number]

        data={"prod":prod,"ord":ord,"tot":tot,"nam":nam}
        print(data)
        return jsonify(data)


@app.route("/admin/authorization/category",methods=["GET"])
@login_required
def admin_authorization():
    if request.method=='GET' and current_user.role=='admin':
        req=Storemanager_category.query.all()
        category=[]
        for i in req:
            print(i.storemanager_id)
            category.append({
                "category_id":i.category_id,
                "category_name":i.category_name,
                "action":i.action,
                "storemanager_id":i.storemanager_id,
                "status":i.status
            })

        user=Users_temp.query.all()
        users=[]
        for i in user:
            users.append({
                "temp_id":i.temp_id,
                "username":i.username,
                "status":i.status,
                "role":i.role,
            })

        data={"category":category,"users":users}
        return jsonify(data)
    if request.method=='GET' and current_user.role=='store_manager':
        req=Storemanager_category.query.filter_by(storemanager_id=current_user.id).all()
        category=[]
        for i in req:
            print(i.storemanager_id)
            category.append({
                "category_id":i.category_id,
                "category_name":i.category_name,
                "action":i.action,
                "storemanager_id":i.storemanager_id,
                "status":i.status
            })
        data={"category":category}
        return jsonify(data)



@app.route("/store/category/update/<string:c>/<string:b>",methods=["GET"])
@login_required
def store_category_authorized_update(c,b):
    if request.method=='GET' and current_user.role=='admin':
        if b=="new":
            req=Storemanager_category.query.filter_by(category_name=c).first()
            req.status="Completed"
            try:
                db.session.commit()
                return jsonify("success")
            except IntegrityError:
                db.session.rollback()
                return jsonify("error")
        else:
            req=Storemanager_category.query.filter(and_(Storemanager_category.category_id==b),(Storemanager_category.status=="Pending")).first()
            req.status="Completed"
            try:
                db.session.commit()
                return jsonify("success")
            except IntegrityError:
                db.session.rollback()
                return jsonify("error")

@app.route("/store/category/reject/<string:c>/<string:b>",methods=["GET"])
@login_required
def store_category_authorized_reject(c,b):
    if request.method=='GET' and current_user.role=='admin':
        if b=="new":
            req=Storemanager_category.query.filter_by(category_name=c).first()
            req.status="Reject"
            try:
                db.session.commit()
                return jsonify("success")
            except IntegrityError:
                db.session.rollback()
                return jsonify("error")
        else:
            req=Storemanager_category.query.filter_by(category_id=b).first()
            req.status="Reject"
            try:
                db.session.commit()
                return jsonify("success")
            except IntegrityError:
                db.session.rollback()
                return jsonify("error")


@app.route("/user/add/<int:temp_id>",methods=["GET"])
@login_required
def temp_user_add(temp_id):
    if request.method=="GET" and current_user.role=='admin':
        user_temp=Users_temp.query.filter_by(temp_id=temp_id).first()
        if user_temp !=None:
            new_user=Users(username=user_temp.username,password=user_temp.password,role="store_manager")
            try:
                db.session.add(new_user)
                db.session.commit()
                return jsonify("success")
            except:
                db.session.rollback()
                return jsonify("error")

        else:
            return jsonify("error")
        

@app.route("/user/update/<int:temp_id>",methods=["GET"])
@login_required
def temp_user_update(temp_id):
    if request.method=="GET" and current_user.role=='admin':
        user_temp=Users_temp.query.filter_by(temp_id=temp_id).first()
        if user_temp !=None:
            use=Users.query.filter_by(username=user_temp.username).first()
            if use==None:
                user_temp.status="Reject"
            else:
                user_temp.status="Completed"
            try:
                db.session.commit()
                return jsonify("success")
            except IntegrityError:
                db.session.rollback()
                return jsonify("error")

        else:
            return jsonify("erWror")


@cel_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(0, 0, day_of_month='1'),
        task.admin_summary_reports.s(),
    )
    sender.add_periodic_task(
        crontab(minute=40,hour=16),
        task.buy_notification.s(),        
    )
    sender.add_periodic_task(
        crontab(minute=40,hour=16),
        task.chat_notification.s(),        
    )








#-----------------------------------------------------------------------user--------------------------------------------------------------------------------#
@app.route("/user/home")
@login_required
def user_home():
    return render_template('user_dashboard.html')

@app.route("/user",methods=["GET","POST"])
def user():
    if request.method=='POST':
        all_values=request.form.to_dict()   
        username=all_values['username']
        password=all_values['password']
        user=Users.query.filter_by(username=username,role='user').first()
        if user==None:
            return render_template('Invalid_username.html')  
        else:
            if bcrypt.check_password_hash(user.password, password):
                login_user(user)
                user.last_login=date.today()
                try:
                    db.session.commit()
                except IntegrityError:
                    db.session.rollback
                return redirect(url_for('user_home'))
            else:
                return render_template('Invalid_username.html')    
    else:
        return render_template('user_login.html')


@app.route("/user/registration",methods=["GET","POST"])
def userregistration():
    if request.method=='POST':
        all_values=request.form.to_dict()
        hashed_password=bcrypt.generate_password_hash(all_values["password"]).decode('utf-8')
        use=Users(username=all_values['username'],password=hashed_password,address=all_values['address'],address2=all_values['address2'],
                  city=all_values['city'],state=all_values['state'],zip=all_values['zip'],role='user',email=all_values["email"])
        try:
            db.session.add(use)
            db.session.commit()
            return redirect('/user')
        except IntegrityError:
            return render_template('username_already.html',username=all_values['username'])
    if request.method=='GET':
        return render_template('user_registration.html')


@app.route("/user/homepage")
@login_required
def user_homepage():
    id=current_user.id
    cat=Category.query.all()
    prod=Product.query.order_by(desc(Product.product_id)).all()
    
    cat_data=[]
    prod_data=[]
    for i in cat:
        if Product.query.filter_by(product_category=i.category_id).all()!=[]:
            c=Product.query.filter_by(product_category=i.category_id).all()
            for b in c:
                if b.product_quantity>0:
                        cat_data.append({
                        "category_id":i.category_id,
                        "category_name":i.category_name,
                        })
                        break
    for i in prod:
        prod_data.append({
            "product_id":i.product_id,
            "product_name":i.product_name,
            "product_quantity":i.product_quantity,
            "product_rate":i.product_rate,
            "product_manufacture":i.product_manufacture,
            "product_expirydate":i.product_expirydate,
            "product_category":i.product_category,
        })

    useru=Users.query.filter_by(id=current_user.id).first()
    user={"username":useru.username,
          "id":useru.id,
          "address":useru.address,
          "address2":useru.address2,
          "city":useru.city,
          "state":useru.state,
          "zip":useru.zip,
          }
    cartu=Cart.query.filter_by(cart_user=current_user.id).all()

    cartl=[]
    for i in cartu:
        if i.cart_productqty>0:
            cartl.append({
            "cart_id":i.cart_id,
            "cart_product":i.cart_product,
            "cart_productqty":i.cart_productqty,
            "cart_productprice":i.cart_productprice,
            "cart_user":i.cart_user
        })
            
        if i.cart_productqty==0:
            db.session.delete(i)
    db.session.commit()    
    cart_productqty={}
    for i in prod:
        if i.product_id not in cart_productqty:
            cart_productqty[i.product_id]=0
    for c in cartu:
        if c.cart_product in cart_productqty:
            cart_productqty[c.cart_product]=c.cart_productqty
    
    data={"prod":prod_data,"cat":cat_data,"cart":cartl,"user":user,"date":date.today(),"cart_productqty":cart_productqty}
    return jsonify(data)


@app.route('/user/<int:id>',methods=["GET","POST"])
@login_required
def user_profile(id):
    if request.method=='GET' and current_user.role=='user':
        useru=Users.query.filter_by(id=current_user.id).first()
        user={"username":useru.username,
          "id":useru.id,
          "address":useru.address,
          "address2":useru.address2,
          "city":useru.city,
          "state":useru.state,
          "zip":useru.zip,
          }
        cartu=Cart.query.filter_by(cart_user=current_user.id).all()
        cartl=[]
        for i in cartu:
            cartl.append({
            "cart_id":i.cart_id,
            "cart_product":i.cart_product,
            "cart_productqty":i.cart_productqty,
            "cart_productprice":i.cart_productprice,
            "cart_user":i.cart_user
        })
        data={"user":user,"cart":cartl,"dat":date.today()}
        return jsonify(data)

@app.route('/user/edit/<int:id>',methods=["POST"])
@login_required
def user_edit(id):
    print("user_edit")
    data=request.get_json()
    user=Users.query.filter_by(id=current_user.id).first()
    user.username=data.get("username")
    user.address=data.get("address")
    user.address2=data.get("address2")
    user.zip=data.get("zip")
    user.state=data.get("state")
    user.city=data.get("city")
    try:
        db.session.commit()
        print("hello")
        return jsonify("profile successfully edited")
    except:
        return jsonify("error")

@app.route('/user/order/history/<int:id>',methods=["GET","POST"])
@login_required
def userorderhistory(id):
    ord=Order.query.filter_by(order_userid=id).all()
    prod=Product.query.all()
    prod_data=[]
    for i in prod:
        prod_data.append({
            "product_id":i.product_id,
            "product_name":i.product_name,
            "product_quantity":i.product_quantity,
            "product_rate":i.product_rate,
            "product_manufacture":i.product_manufacture,
            "product_expirydate":i.product_expirydate,
            "product_category":i.product_category,
        })

    totu=Total.query.all()
    tot=[]
    for i in totu:
        tot.append({
                "total_ordernumber":i.total_ordernumber,
                "total_orderamount":i.total_orderamount,
                "total_orderaddress":i.total_orderaddress,
                "total_orderaddress2":i.total_orderaddress2,
                "total_ordercity":i.total_ordercity,
                "total_orderstate":i.total_orderstate,
                "total_orderzip":i.total_orderzip,
                "total_orderrating":i.total_orderrating,
                "total_orderdate":i.total_orderdate       
            })
    useru=Users.query.filter_by(id=id).first()
    user={"username":useru.username,
          "id":useru.id,
          "address":useru.address,
          "address2":useru.address2,
          "city":useru.city,
          "state":useru.state,
          "zip":useru.zip,
          }

    ordn=[]
    ordl=[]
    
    for i in ord:
        if i.order_number not in ordn:
            ordn.append(i.order_number)
    for i in ordn:
        lis=[]
        for c in ord:
            if c.order_number==i:
                lis.append({
                "order_number":c.order_number,
                "order_itemnumber":c.order_itemnumber,
                "order_itemprice":c.order_itemprice,
                "order_qty":c.order_qty,
                "order_userid":c.order_userid,
                "order_productid":c.order_productid
                })
        ordl.append(lis)
    cartn=len(Cart.query.filter_by(cart_user=id).all())
    data={"ordl":ordl,"user":user,"cart":cartn,"dat":date.today(),'tot':tot,"prod":prod_data}
    return jsonify(data)


@app.route('/user/order/rating/<int:order>/<int:rating>/<int:userid>',methods=["GET","POST"])
@login_required
def user_rating(order,rating,userid):
    if request.method=='GET' and current_user.id==userid:
        tot=Total.query.filter_by(total_ordernumber=order).first()
        tot.total_orderrating=int(rating)
        try:
            db.session.commit()
            return jsonify("rating updated successfully")
        except:
            return jsonify("error")
        
@app.route("/user/search/<int:id>/<string:search>",methods=["GET","POST"])
@login_required
def usersearch(id,search):
    print("b")
    k='%'+search+'%'
    prod = Product.query.filter(and_(Product.product_name.ilike(k)),Product.product_quantity>0).order_by(desc(Product.product_id)).all()
    catal=[]
    cat=[]
    for i in prod:
        v=Category.query.filter_by(category_id=i.product_category).first()
        if v.category_id not in catal:
            catal.append(v.category_id)
    catal.sort()
    for i in catal:
        cat.append(Category.query.filter_by(category_id=i).first())
    cat_data=[]
    prod_data=[]
    for i in cat:
        cat_data.append({
                "category_id":i.category_id,
                "category_name":i.category_name,
            })
    for i in prod:
        prod_data.append({
            "product_id":i.product_id,
            "product_name":i.product_name,
            "product_quantity":i.product_quantity,
            "product_rate":i.product_rate,
            "product_manufacture":i.product_manufacture,
            "product_expirydate":i.product_expirydate,
            "product_category":i.product_category,
        })

    useru=Users.query.filter_by(id=current_user.id).first()
    user={"username":useru.username,
          "id":useru.id,
          "address":useru.address,
          "address2":useru.address2,
          "city":useru.city,
          "state":useru.state,
          "zip":useru.zip,
          }
    cartu=Cart.query.filter_by(cart_user=current_user.id).all()
    print(cartu)
    cartl=[]
    for i in cartu:
        cartl.append({
            "cart_id":i.cart_id,
            "cart_product":i.cart_product,
            "cart_productqty":i.cart_productqty,
            "cart_productprice":i.cart_productprice,
            "cart_user":i.cart_user
        })
    cart_productqty={}
    for i in prod:
        if i.product_id not in cart_productqty:
            cart_productqty[i.product_id]=0
    for c in cartu:
        if c.cart_product in cart_productqty:
            cart_productqty[c.cart_product]=c.cart_productqty
    data={"prod":prod_data,"cat":cat_data,"cart":cartl,"user":user,"date":date.today(),"cart_productqty":cart_productqty}

    return jsonify(data)

def cart_ex(a):
    cartu=Cart.query.filter_by(cart_user=a).all()
    prod=Product.query.all()
    cart_productqty={}
    for i in prod:
        if i.product_id not in cart_productqty:
            cart_productqty[i.product_id]=0
    for c in cartu:
        if c.cart_product in cart_productqty:
            cart_productqty[c.cart_product]=c.cart_productqty
    return cart_productqty


@app.route("/user/advsearch/<int:id>/<string:opt>/<string:val>",methods=["GET","POST"])
@login_required
def useradvsearch(id,opt,val):
    if opt=='product':
        return redirect(f'/user/search/{id}/{val}')
    if opt=='category':
        k='%'+val+'%'
        catall=Category.query.filter(Category.category_name.ilike(k)).all()
        cat=[]
        v='category'
        for i in catall:
            if Product.query.filter_by(product_category=i.category_id).all()!=[]:
                cat.append(i)
        prodall=Product.query.filter(Product.product_quantity>0).order_by(desc(Product.product_id)).all()
        prod=[]
        catno=[]
        for i in cat:
            catno.append(i.category_id)
        for c in prodall:
            if c.product_category in catno:
                prod.append(c)
        prod_data=[]
        for i in prod:
            prod_data.append({
            "product_id":i.product_id,
            "product_name":i.product_name,
            "product_quantity":i.product_quantity,
            "product_rate":i.product_rate,
            "product_manufacture":i.product_manufacture,
            "product_expirydate":i.product_expirydate,
            "product_category":i.product_category,
        })        
        cartu=Cart.query.filter_by(cart_user=current_user.id).all()
        cartl=[]
        for i in cartu:
            cartl.append({
            "cart_id":i.cart_id,
            "cart_product":i.cart_product,
            "cart_productqty":i.cart_productqty,
            "cart_productprice":i.cart_productprice,
            "cart_user":i.cart_user
        })
        cat_data=[]
        for i in cat:
            cat_data.append({
                "category_id":i.category_id,
                "category_name":i.category_name,
            })
        useru=Users.query.filter_by(id=current_user.id).first()
        user={"username":useru.username,
          "id":useru.id,
          "address":useru.address,
          "address2":useru.address2,
          "city":useru.city,
          "state":useru.state,
          "zip":useru.zip,
          }
        data={"prod":prod_data,"cat":cat_data,"cart":cartl,"user":user,"date":date.today(),"cart_productqty":cart_ex(current_user.id)}
        return jsonify(data)
    if opt=='price_less':
        k=val
        prod=Product.query.filter(and_(Product.product_rate<=k),(Product.product_quantity>0)).order_by(desc(Product.product_id)).all()
        prod_data=[]
        for i in prod:
            prod_data.append({
            "product_id":i.product_id,
            "product_name":i.product_name,
            "product_quantity":i.product_quantity,
            "product_rate":i.product_rate,
            "product_manufacture":i.product_manufacture,
            "product_expirydate":i.product_expirydate,
            "product_category":i.product_category,
        })
        catal=[]
        cat=[]
        for i in prod:
            v=Category.query.filter_by(category_id=i.product_category).first()
            if v.category_id not in catal:
                catal.append(v.category_id)
        catal.sort()
        for i in catal:
            cat.append(Category.query.filter_by(category_id=i).first())
        cartu=Cart.query.filter_by(cart_user=current_user.id).all()
        cartl=[]
        for i in cartu:
            cartl.append({
            "cart_id":i.cart_id,
            "cart_product":i.cart_product,
            "cart_productqty":i.cart_productqty,
            "cart_productprice":i.cart_productprice,
            "cart_user":i.cart_user
        })
        cat_data=[]
        for i in cat:
            cat_data.append({
                "category_id":i.category_id,
                "category_name":i.category_name,
            })
        useru=Users.query.filter_by(id=current_user.id).first()
        user={"username":useru.username,
          "id":useru.id,
          "address":useru.address,
          "address2":useru.address2,
          "city":useru.city,
          "state":useru.state,
          "zip":useru.zip,
          }
        data={"prod":prod_data,"cat":cat_data,"cart":cartl,"user":user,"date":date.today(),"cart_productqty":cart_ex(current_user.id)}
        return jsonify(data)           
    if opt=='price_more':
        k=val
        prod=Product.query.filter(and_(Product.product_rate>=k),(Product.product_quantity>0)).order_by(desc(Product.product_id)).all()
        prod_data=[]
        for i in prod:
            prod_data.append({
            "product_id":i.product_id,
            "product_name":i.product_name,
            "product_quantity":i.product_quantity,
            "product_rate":i.product_rate,
            "product_manufacture":i.product_manufacture,
            "product_expirydate":i.product_expirydate,
            "product_category":i.product_category,
        })
        catal=[]
        cat=[]
        for i in prod:
            v=Category.query.filter_by(category_id=i.product_category).first()
            if v.category_id not in catal:
                catal.append(v.category_id)
        catal.sort()
        for i in catal:
            cat.append(Category.query.filter_by(category_id=i).first())
        cartu=Cart.query.filter_by(cart_user=current_user.id).all()
        cartl=[]
        for i in cartu:
            cartl.append({
            "cart_id":i.cart_id,
            "cart_product":i.cart_product,
            "cart_productqty":i.cart_productqty,
            "cart_productprice":i.cart_productprice,
            "cart_user":i.cart_user
        })
        cat_data=[]
        for i in cat:
            cat_data.append({
                "category_id":i.category_id,
                "category_name":i.category_name,
            })
        useru=Users.query.filter_by(id=current_user.id).first()
        user={"username":useru.username,
          "id":useru.id,
          "address":useru.address,
          "address2":useru.address2,
          "city":useru.city,
          "state":useru.state,
          "zip":useru.zip,
          }
        data={"prod":prod_data,"cat":cat_data,"cart":cartl,"user":user,"date":date.today(),"cart_productqty":cart_ex(current_user.id)}
        return jsonify(data)
    if opt=="expiry_date":
        c=val
        prod=Product.query.filter(and_(Product.product_expirydate<=c),(Product.product_quantity>0)).order_by(desc(Product.product_id)).all()
        prod_data=[]
        for i in prod:
            prod_data.append({
            "product_id":i.product_id,
            "product_name":i.product_name,
            "product_quantity":i.product_quantity,
            "product_rate":i.product_rate,
            "product_manufacture":i.product_manufacture,
            "product_expirydate":i.product_expirydate,
            "product_category":i.product_category,
        })
        catal=[]
        cat=[]
        v='expiry-date'
        for i in prod:
            v=Category.query.filter_by(category_id=i.product_category).first()
            if v.category_id not in catal:
                catal.append(v.category_id)
        catal.sort()
        for i in catal:
            cat.append(Category.query.filter_by(category_id=i).first())
        cartu=Cart.query.filter_by(cart_user=current_user.id).all()
        cartl=[]
        for i in cartu:
            cartl.append({
            "cart_id":i.cart_id,
            "cart_product":i.cart_product,
            "cart_productqty":i.cart_productqty,
            "cart_productprice":i.cart_productprice,
            "cart_user":i.cart_user
        })
        cat_data=[]
        for i in cat:
            cat_data.append({
                "category_id":i.category_id,
                "category_name":i.category_name,
            })
        useru=Users.query.filter_by(id=current_user.id).first()
        user={"username":useru.username,
          "id":useru.id,
          "address":useru.address,
          "address2":useru.address2,
          "city":useru.city,
          "state":useru.state,
          "zip":useru.zip,
          }
        data={"prod":prod_data,"cat":cat_data,"cart":cartl,"user":user,"date":date.today(),"cart_productqty":cart_ex(current_user.id)}
        return jsonify(data)

@app.route('/user/order/history/<int:id>/<int:ord>',methods=["GET","POST"])
@login_required
def userorderhistorynumber(id,ord):   
    ord=Order.query.filter_by(order_userid=id,order_number=ord ).all()
    prod=Product.query.all()
    prod_data=[]
    for i in prod:
        prod_data.append({
            "product_id":i.product_id,
            "product_name":i.product_name,
            "product_quantity":i.product_quantity,
            "product_rate":i.product_rate,
            "product_manufacture":i.product_manufacture,
            "product_expirydate":i.product_expirydate,
            "product_category":i.product_category,
        })

    totu=Total.query.all()
    tot=[]
    for i in totu:
        tot.append({
                "total_ordernumber":i.total_ordernumber,
                "total_orderamount":i.total_orderamount,
                "total_orderaddress":i.total_orderaddress,
                "total_orderaddress2":i.total_orderaddress2,
                "total_ordercity":i.total_ordercity,
                "total_orderstate":i.total_orderstate,
                "total_orderzip":i.total_orderzip,
                "total_orderrating":i.total_orderrating,
                "total_orderdate":i.total_orderdate       
            })
    useru=Users.query.filter_by(id=id).first()
    user={"username":useru.username,
          "id":useru.id,
          "address":useru.address,
          "address2":useru.address2,
          "city":useru.city,
          "state":useru.state,
          "zip":useru.zip,
          }

    ordn=[]
    ordl=[]
    
    for i in ord:
        if i.order_number not in ordn:
            ordn.append(i.order_number)
    for i in ordn:
        lis=[]
        for c in ord:
            if c.order_number==i:
                lis.append({
                "order_number":c.order_number,
                "order_itemnumber":c.order_itemnumber,
                "order_itemprice":c.order_itemprice,
                "order_qty":c.order_qty,
                "order_userid":c.order_userid,
                "order_productid":c.order_productid
                })
        ordl.append(lis)
    cartn=len(Cart.query.filter_by(cart_user=id).all())
    data={"ordl":ordl,"user":user,"cart":cartn,"dat":date.today(),'tot':tot,"prod":prod_data}
    print(data)
    return jsonify(data)


@app.route("/user/cart/<int:id>/<int:product_id>/<int:product_quantity>",methods=["GET","POST"])
@login_required
def usercartadd(id,product_id,product_quantity):
    if current_user.role=='user' and current_user.id==id:
        print(product_quantity)
        if product_quantity==9999999:
            print("aa")
            user=Users.query.filter_by(id=id).first()
            prod=Product.query.filter_by(product_id=product_id).first()
            carto=Cart.query.filter_by(cart_product=product_id,cart_user=id).first()
            if carto==None:
                print("ccc")
                cart=Cart(cart_product=prod.product_id,cart_productqty=product_quantity,cart_productprice=prod.product_rate,cart_user=user.id)
                db.session.add(cart)
            else:
                print("dd")
                qty=carto.cart_productqty -1
                if qty <= prod.product_quantity:
                    carto.cart_productqty=qty
                else:
                    return jsonify("error")
            db.session.commit()
            return jsonify("cart added successfully")
        else:
            user=Users.query.filter_by(id=id).first()
            prod=Product.query.filter_by(product_id=product_id).first()
            carto=Cart.query.filter_by(cart_product=product_id,cart_user=id).first()
            if carto==None:
                cart=Cart(cart_product=prod.product_id,cart_productqty=product_quantity,cart_productprice=prod.product_rate,cart_user=user.id)
                db.session.add(cart)
            else:
                qty=int(product_quantity)
                if qty <= prod.product_quantity:
                    carto.cart_productqty=qty
                else:
                    return jsonify("error")
            db.session.commit()
            return jsonify("cart added successfully")

@app.route("/user/cart/delete/<int:id>/<int:cart_id>")
@login_required
def usercartdelete(id,cart_id):
    if request.method=='GET' and current_user.role=='user' and current_user.id==id:
        carde=Cart.query.filter_by(cart_id=cart_id).first()
        if carde!=None:
            db.session.delete(carde)
            db.session.commit()
            return jsonify("successfully deleted")
        return jsonify("error")
    


@app.route('/user/order/<int:id>',methods=["GET","POST"])
@login_required
def userorder(id):
    if request.method=='POST' and current_user.role=='user' and current_user.id==id:
        user=Users.query.filter_by(id=id).first()
        print(user.email)
        cart=Cart.query.filter_by(cart_user=id).all()
        all_values=request.form.to_dict()
        carnox=[]
        carav=[]
        datu=request.get_json()
        if cart !=[]:
            total=0
            for k in cart:
                prod=Product.query.filter_by(product_id=k.cart_product).first()
                if k.cart_productqty<=prod.product_quantity:
                    total+=(k.cart_productqty*k.cart_productprice)
                    carav.append(k)
                else:
                    carnox.append(k)
                    db.session.delete(k)
            if carnox!=[]:
                db.session.commit()
            carno=[]
            for i in carnox:
                carno.append({
            "cart_id":i.cart_id,
            "cart_product":i.cart_product,
            "cart_productqty":i.cart_productqty,
            "cart_productprice":i.cart_productprice,
            "cart_user":i.cart_user
                })
            num=0
            ord=Order.query.order_by(desc(Order.order_number)).first()
            if ord==None:
                order_numb=1
            else:
                order_numb=ord.order_number + 1
            for i in carav:
                prod=Product.query.filter_by(product_id=i.cart_product).first()
                num=num+1
                new_order=Order(order_number=order_numb,order_itemprice=i.cart_productprice,order_qty=i.cart_productqty,order_userid=i.cart_user,order_productid=i.cart_product,order_itemnumber=num)
                db.session.add(new_order)
            db.session.commit()
            for i in cart:
                prou=Product.query.filter_by(product_id=i.cart_product).first()
                if i in carav:
                    prou.product_quantity=prou.product_quantity-i.cart_productqty
                db.session.delete(i)
            if carav!=[]:
                totu=Total(total_ordernumber=order_numb,total_orderamount=total,total_orderaddress=datu.get('address'),total_orderaddress2=datu.get('address2'),
                           total_ordercity=datu.get('city'),total_orderzip=datu.get('zip'),total_orderstate=datu.get('state'),total_orderdate=date.today())
                db.session.add(totu)
            db.session.commit()    
            useru=Users.query.filter_by(id=id).first()
            user={"username":useru.username,
              "id":useru.id,
              "address":useru.address,
              "address2":useru.address2,
                "city":useru.city,
            "state":useru.state,
                "zip":useru.zip,
             }

            prod=Product.query.all()
            prod_data=[]
            for i in prod:
                prod_data.append({
            "product_id":i.product_id,
            "product_name":i.product_name,
            "product_quantity":i.product_quantity,
            "product_rate":i.product_rate,
            "product_manufacture":i.product_manufacture,
            "product_expirydate":i.product_expirydate,
            "product_category":i.product_category,
            })
            ordcx=Order.query.filter_by(order_number=order_numb).all()
            ordc=[]
            for c in ordcx:
                ordc.append({
                "order_number":c.order_number,
                "order_itemnumber":c.order_itemnumber,
                "order_itemprice":c.order_itemprice,
                "order_qty":c.order_qty,
                "order_userid":c.order_userid,
                "order_productid":c.order_productid
                })

            totx=Total.query.filter_by(total_ordernumber=order_numb).first()
            tot={
                "total_ordernumber":totx.total_ordernumber,
                "total_orderamount":totx.total_orderamount,
                "total_orderaddress":totx.total_orderaddress,
                "total_orderaddress2":totx.total_orderaddress2,
                "total_ordercity":totx.total_ordercity,
                "total_orderstate":totx.total_orderstate,
                "total_orderzip":totx.total_orderzip,
                "total_orderrating":totx.total_orderrating,
                "total_orderdate":totx.total_orderdate       
            }

            delivery_date=date.today()+timedelta(days=3)
            cart=len(Cart.query.filter_by(cart_user=id).all())
            data={"carno":carno,"cart":cart,"dat":date.today(),"prod":prod_data,"user":user,"ordc":ordc,"tot":tot,"delivery_date":delivery_date}
            html_content= render_template("invoice.html", ordcx=ordcx, user=useru, prod=prod, totx=totx, carnox=carnox, dat=date.today(), delivery_date=delivery_date)
            options = {
                    'page-size': 'A4',
                    'orientation': 'Portrait',
                    'margin-top': '0mm',
                    'margin-right': '0mm',
                    'margin-bottom': '0mm',
                    'margin-left': '0mm',
                }
            pdfkit.from_string(html_content,"order_thanks.pdf", options=options)
            task.send_mail.delay(useru.email,"ORDER DETAILS",html_content,["order_thanks.pdf"])
            return jsonify(data)
        
#-------------------------------------------------------------Store Manager--------------------------------------------------------------------------------#

@app.route("/store_manager/home")
@login_required
def store_manager_home():
    if current_user.role=="store_manager":
        return render_template('store_manager_dashboard.html')

@app.route("/store_manager",methods=["GET","POST"])
def storemanager():
    if request.method=='POST':
        all_values=request.form.to_dict()   
        username=all_values['username']
        password=all_values['password']
        print("before",password)
        user=Users.query.filter_by(username=username,role='store_manager').first()
        print(user)
        if user==None:
            return render_template('Invalid_username.html')  
        else:
            if bcrypt.check_password_hash(user.password, password):
                login_user(user)
                user.last_login=date.today()
                try:
                    db.session.commit()
                except IntegrityError:
                    db.session.rollback()
                return redirect(url_for('store_manager_home'))
            else:
                return render_template('Invalid_username.html')    
    else:
        return render_template('store_manager_login.html')


@app.route("/store_manager/registration",methods=["GET","POST"])
def storemanagerregistration():
    if request.method=='POST':
        all_values=request.form.to_dict()
        hashed_password=bcrypt.generate_password_hash(all_values["password"]).decode('utf-8')
        use=Users_temp(username=all_values['username'],password=hashed_password,role='store_manager',status='Pending')
        try:
            db.session.add(use)
            db.session.commit()
            return redirect('/store_manager')
        except IntegrityError:
            return render_template('username_already.html')
    if request.method=='GET':
        return render_template('store_manager_registration.html')
            


@app.route("/store/edit_categories",methods=["GET","POST"])
@login_required
def store_edit_categories():
    if request.method=='POST' and current_user.role=="store_manager":
        data=request.get_json()
        req=Storemanager_category.query.filter(and_(Storemanager_category.category_id==data["category_id"],Storemanager_category.status=='Pending',Storemanager_category.storemanager_id==current_user.id)).first()
        if req==None:
            new_request=Storemanager_category(category_id=data["category_id"],action=data["action"],status='Pending',category_name=data["category_name"],storemanager_id=current_user.id)
            try:
                db.session.add(new_request)
                db.session.commit()
                return jsonify ("category successfully added")
            except IntegrityError:
                print("here")
                db.session.rollback()
                return jsonify ("category name already present")
        else:
            if req.action=="Delete":
                return jsonify("category already requested for delete")
            if req.action=="Edit":
                req.category_name=data["category_name"]
                try:
                    db.session.commit()
                    return jsonify("category successfully added")
                except IntegrityError:
                    print("hello")
                    db.session.rollback()
                    return jsonify("category name already present")

@app.route("/store/delete_categories/<int:category_id>",methods=["GET"])
@login_required
def store_delete_categories(category_id):
    if request.method=='GET' and current_user.role=="store_manager":
        req=Storemanager_category.query.filter_by(category_id=category_id).first()
        cat=Category.query.filter_by(category_id=category_id).first()
        if req==None:
            new_request=Storemanager_category(category_id=category_id,action="Delete",status='Pending',category_name=cat.category_name,storemanager_id=current_user.id)
            try:
                db.session.add(new_request)
                db.session.commit()
                return jsonify ("category successfully added for deletion")
            except IntegrityError:
                db.session.rollback()
                return jsonify ("error")
        else:
            if req.action=="Delete":
                return jsonify("category already requested for delete")
            if req.action=="Edit":
                req.action='Delete'
                try:
                    db.session.commit()
                    return jsonify("category successfully added for deletion")
                except IntegrityError:
                    db.session.rollback()
                    return jsonify("error")

@app.route("/store/add_categories",methods=["POST"])
@login_required
def store_add_categories():
    if request.method=='POST' and current_user.role=='store_manager':
        data=request.get_json()
        req=Storemanager_category.query.filter_by(category_name=data["category_name"]).first()
        if req==None:
            new_request=Storemanager_category(category_id="new",action="Add",status='Pending',category_name=data["category_name"],storemanager_id=current_user.id)
            try:
                db.session.add(new_request)
                db.session.commit()
                return jsonify ("category successfully added for creation")
            except IntegrityError:
                print("error")
                db.session.rollback()
                return jsonify ("error")
        else:
            return jsonify ("category with the same name already exists")

@app.route("/store/csv/products",methods=["GET"])
@login_required
def product_csv():
    s=task.product_csv_cel.delay()
    data={
        "id":s.id,
        "status":s.status,
        "result":s.result
    }
    return jsonify(data)

@app.route("/store/csv/<id>",methods=["GET"])
@login_required
def product_csv_res(id):
    res=AsyncResult(id)
    data={ "id":res.id,
        "status":res.status,
        "result":res.result
        }
    return jsonify (data)

@app.route("/download/csv",methods=["GET"])
@login_required
def download_csv():
    print("inside")
    return send_file("static/products.csv")




@app.route("/upload",methods=["POST"])
@login_required
def upload_csv():
    print("hello")
    UPLOAD_FOLDER = 'static/' 
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    file = request.files['csv_file']
    filename=os.path.join(app.config['UPLOAD_FOLDER'],file.filename)
    file.save(filename)
    task.add_product_csv_cel.delay(file.filename,current_user.id)
    return jsonify("file uploaded successfully")



@app.route("/store/task",methods=["GET"])
@login_required
def store_task():
    request=Tasks.query.filter_by(user_id=current_user.id).all()
    tasks=[]
    for i in request:
        tasks.append({
            "file_name":i.task_name,
            "category_absent":i.result["category_absent"],
            "product_already":i.result["product_already"],
            "date":i.created_at
        })
    data={"tasks":tasks}
    return jsonify(data)


#-------------------------------------------------------------------------------run------------------------------------------------------------------#
if __name__=="__main__":
    app.run(host='0.0.0.0',debug=True)
