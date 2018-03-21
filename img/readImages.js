let fs=require("fs");
let ary=fs.readdirSync('./');

let result=[];
for(let i=0;i<ary.length;i++){
    let item=ary[i];
   if(/\.[PNG|JPG|GIF]/i.test(item)){
      result.push("img/"+item);
   }
}
fs.writeFileSync('./result2.txt',JSON.stringify(result),'utf-8');