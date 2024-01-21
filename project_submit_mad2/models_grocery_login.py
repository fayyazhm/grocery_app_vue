from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum,Time,exc,DATE,desc,and_
from flask_login import LoginManager,login_user,current_user,login_required,UserMixin
from flask import Flask,render_template,request,redirect,jsonify,url_for,send_file

db=SQLAlchemy()
app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///grocery_login.sqlite3"
app.config['SECRET_KEY']= "SECRETKEYSECRETKEYSECRETKEY121213121312"
db.init_app(app)
login_manager=LoginManager()
login_manager.init_app(app)
app.app_context().push() 




class Users(db.Model,UserMixin):
    id=db.Column(db.Integer(),autoincrement=True, primary_key=True)
    username=db.Column(db.String(), unique=True)
    password=db.Column(db.String(),nullable=False)
    role=db.Column(Enum('admin','user','store_manager'),nullable=False)
    address=db.Column(db.String())
    address2=db.Column(db.String())
    city=db.Column(db.String())
    state=db.Column(db.String())
    zip=db.Column(db.Integer())
    last_login=db.Column(db.Date())
    email=db.Column(db.String())
    ubooking=db.relationship('Order',backref="book")
    
class Category(db.Model):
    category_id=db.Column(db.Integer(),autoincrement=True, primary_key=True)
    category_name=db.Column(db.String(),unique=True,nullable=False)  
    prod=db.relationship('Product',backref="item")


class Product(db.Model):
    product_id=db.Column(db.Integer(),autoincrement=True, primary_key=True)
    product_name=db.Column(db.String(),nullable=False,unique=True)
    product_quantity=db.Column(db.Integer(),nullable=False)
    product_rate=db.Column(db.Integer(),nullable=False)
    product_manufacture=db.Column(db.String(),nullable=False)
    product_expirydate=db.Column(db.Date(),nullable=False)
    product_category=db.Column(db.Integer(),db.ForeignKey('category.category_id'),nullable=False)
    product_order=db.relationship('Order',backref="ord")

class Order(db.Model):
    order_number=db.Column(db.Integer(),db.ForeignKey('total.total_ordernumber'), primary_key=True)
    order_itemnumber=db.Column(db.Integer(),primary_key=True)
    order_itemprice=db.Column(db.Integer(),nullable=False)
    order_qty=db.Column(db.Integer(),nullable=False)
    order_userid=db.Column(db.Integer(),db.ForeignKey('users.id'),nullable=False)
    order_productid=db.Column(db.Integer(),db.ForeignKey('product.product_id'),nullable=False)

class Cart(db.Model):
    cart_id=db.Column(db.Integer(),autoincrement=True, primary_key=True)
    cart_product=db.Column(db.Integer(),db.ForeignKey('product.product_id'),nullable=False)
    cart_productqty=db.Column(db.Integer(),nullable=False)
    cart_productprice=db.Column(db.Integer(),nullable=False)
    cart_user=db.Column(db.Integer(),db.ForeignKey('users.id'),nullable=False)

class Total(db.Model):
    total_ordernumber=db.Column(db.Integer(),primary_key=True)
    total_orderamount=db.Column(db.Integer())
    total_orderaddress=db.Column(db.String())
    total_orderaddress2=db.Column(db.String())
    total_ordercity=db.Column(db.String())
    total_orderstate=db.Column(db.String())
    total_orderzip=db.Column(db.Integer())
    total_orderrating=db.Column(db.Integer())
    total_orderdate=db.Column(db.Date(),nullable=False)


class Storemanager_category(db.Model):
    sl_no=db.Column(db.Integer(),autoincrement=True,primary_key=True)
    category_id=db.Column(db.String())
    category_name=db.Column(db.Integer())
    action=db.Column(db.String())
    storemanager_id=db.Column(db.Integer(),db.ForeignKey('users.id'))
    status=db.Column(db.String())


class Users_temp(db.Model,UserMixin):
    temp_id=db.Column(db.Integer(),autoincrement=True, primary_key=True)
    username=db.Column(db.String(), unique=True)
    password=db.Column(db.String(),nullable=False)
    role=db.Column(Enum('store_manager'),nullable=False)
    status=db.Column(db.String())

class Tasks(db.Model):
    sl_no=db.Column(db.Integer(),autoincrement=True, primary_key=True)
    task_name=db.Column(db.String())
    result=db.Column(db.JSON)
    user_id=db.Column(db.Integer(),db.ForeignKey('users.id'))
    created_at=db.Column(db.DateTime, default=datetime.now)

db.create_all()