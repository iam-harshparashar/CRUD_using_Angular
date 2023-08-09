import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Products } from './model/products';
import { ProductService } from './service/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'taskhttpcrud';
  allProducts:Products[]=[];
  isfetching:boolean;
  editMode:boolean=false;
  currentProductId:string;
  errMessage:string=null;
  errorSub:Subscription;
  @ViewChild('productsForm') form:NgForm;
  
  constructor(private productService:ProductService){

  }
  ngOnInit(){
    this.fetchproducts();
    this.errorSub = this.productService.error.subscribe((message) =>{
      this.errMessage =message;

    })
  }
  OnProductFetch(){
    this.fetchproducts();
  }

  onProductCreate(products:{pName:string , pDesc:string , pPrice:number}){
    if(!this.editMode)
      this.productService.createProduct(products);
    else
      this.productService.updateProduct(this.currentProductId,products);
 

  }
  private fetchproducts(){
    this.isfetching =true;
    this.productService.fetchProduct().subscribe((products) =>{
      this.allProducts =products;
      this.isfetching =false;
    },(err)=>{
      this.errMessage=err.message;
    })
   
  }
  onDeleteProduct(id:string){
    this.productService.deleteProduct(id);
   
  }
  onDeleteAllProducts(){
    this.productService.deleteAllProducts();
  }
  onEditClicked(id:string){
    this.currentProductId =id;
    //get the product based on id
    let currentProduct = this.allProducts.find((p)=>{return p.id===id});
    // console.log(this.form.value);
    
    //populate the form with the product details 
    this.form.setValue({
      pName:currentProduct.pName,
      pDesc:currentProduct.pDesc,
      pPrice:currentProduct.pPrice
    });
    //change the button value to update product
    this.editMode=true;
  }
  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
  
}
