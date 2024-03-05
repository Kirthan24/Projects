import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PasswordManagerService } from '../password-manager.service';
import { Observable } from 'rxjs';
import {AES,enc} from 'crypto-js';
@Component({
  selector: 'app-password-list',
  templateUrl: './password-list.component.html',
  styleUrl: './password-list.component.css'
})
export class PasswordListComponent {
  siteId !:string;
  siteName !:string;
  siteURL !:string;
  siteImgURL !: string;
  passwordList !:Array<any>

  email !: string;
  username !: string;
  password !:string;
  passwordId !:string;
  formState :string='Add new';
  isSuccess:boolean=false;
  successMessage!:string;
  constructor(private route:ActivatedRoute,private passwordManagerService:PasswordManagerService){
    this.route.queryParams.subscribe((val:any)=>{
      this.siteId=val.id;
      this.siteName=val.siteName;
      this.siteURL=val.siteURL;
      this.siteImgURL=val.siteImgURL;
    })
    this.loadPasswords();
  }
  showAlert(message:string){
    this.isSuccess=true;
    this.successMessage=message;

  }
  resetForms(){
    this.email='';
    this.username='';
    this.password='';
    this.passwordId='';
    this.formState='Add new';
  }
  onSubmit(values:any){
    console.log(values)
   const encryptedPassword= this.encryptPassword(values.password);
   values.password=encryptedPassword;
   console.log(values)
    if(this.formState=='Add new'){
      this.passwordManagerService.addPassword(values,this.siteId)
      .then(()=>{
        this.showAlert('Data saved Successfully')
        this.resetForms();
      })
      .catch(err=>{
        console.log(err);
      })
    }
    else if(this.formState=='Edit'){
      this.passwordManagerService.updatePassword(this.siteId,this.passwordId,values)
      .then(()=>{
        this.showAlert('Data Updated Successfully')
        this.resetForms();
      })
      .catch(err=>{
        console.log(err);
      })
    }
   
  }
  loadPasswords(){
   this.passwordManagerService.loadPasswords(this.siteId).subscribe(val=>{
    this.passwordList=val;
   })
    
  }
  editPassword(email:string,username:string,password:string,paswordId:string){
    this.email=email;
    this.username=username;
    this.password=password;
    this.passwordId=paswordId;
    this.formState='Edit'
  }
  deletePassword(passwordId:string){
    this.passwordManagerService.deletePassword(this.siteId,passwordId)
    .then(()=>{
      this.showAlert('Data Deleted ')
      this.resetForms();
    })
    .catch(err=>{
      console.log(err);
    })

  }
  encryptPassword(password:string){
    const secretKey='5u8x/A%D*G-KaPdSgVkYp3s6v9y$B&E(';
    const encryptedPassword=AES.encrypt(password,secretKey).toString()
    return encryptedPassword;
  }
  decryptPassword(password:string){
    const secretKey='5u8x/A%D*G-KaPdSgVkYp3s6v9y$B&E(';
    const decrPassword=AES.decrypt(password,secretKey).toString(enc.Utf8);
    return decrPassword;
  }
  onDecrypt(password:string,index:number){
    const decPassword=this.decryptPassword(password);
    this.passwordList[index].password=decPassword
  }
}
