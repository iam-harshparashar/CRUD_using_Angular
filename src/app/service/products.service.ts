import { HttpClient ,HttpHeaders, HttpParams} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import { Products } from '../model/products';

@Injectable({providedIn:"root"})
export class ProductService{
    error =new Subject<string>();
    constructor(private http: HttpClient){

    }
    createProduct(products:{pName:string , pDesc:string , pPrice:number}){
        //create data in database
           //console.log(products);
    const headers =new HttpHeaders({'headers':'learning'})
    this.http.post<{name: string}>('https://crudhp-default-rtdb.firebaseio.com/product.json',products,{headers:headers})
    .subscribe((res)=>{
      console.log(res);
    },(err) =>{
        this.error.next(err.message);
    });

    }
    fetchProduct(){
        const header = new HttpHeaders()
        .set('content-type','application/json').set('Acess-Control-Allow-Origin','*')
        //fetch data in database
        const params =new HttpParams().set('print','params').set('pagenumber','1');
        return this.http.get<{[key:string]:Products}>('https://crudhp-default-rtdb.firebaseio.com/product.json',{headers:header,params:params})
        .pipe(map((res)=>{
          const products=[];
          for(const key in res){
            if(res.hasOwnProperty(key)){
              products.push({...res[key],id:key})
            }
            
          }
          return products;
          
        }), catchError((err) =>{
            //write the logic for logging error 
            return throwError(err);
        }))
     
        
    }
    deleteProduct(id:string){
      let header = new HttpHeaders();
      header= header.append('header1', 'value1')
      header= header.append('header2', 'value2')
        //delete data from database
        this.http.delete('https://crudhp-default-rtdb.firebaseio.com/product/'+id+'.json',{headers:header})
        .subscribe();
        
    }
    deleteAllProducts(){
        //delete all product from the database
        this.http.delete('https://crudhp-default-rtdb.firebaseio.com/product/.json')
        .subscribe();
        
    }
    updateProduct(id:string,value:Products){
        this.http.put('https://crudhp-default-rtdb.firebaseio.com/product/'+id+'.json',value)
        .subscribe();
    }

}