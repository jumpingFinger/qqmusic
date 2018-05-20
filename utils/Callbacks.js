~function anonymous(window) {
    class Callbacks{
        constructor(){
            this.pond=[];
        }
        add (fn){
            let pond=this.pond,
            isExist=false;
            pond.forEach((item)=>{
                item===fn?isExist=true:null;
            });
            if(!isExist){
                pond.push(fn);
            }
        }
        remove(fn){
            let pond=this.pond;
            pond.forEach((item,index)=>{
                if(item===fn){
                    pond[index]=null;
                }
            })
        }
        fire(...arg){
            let pond=this.pond;
            for (let i = 0; i < pond.length; i++) {
                let item=pond[i];
                if(item===null){
                    pond.splice(i,1);
                    i--;
                    continue;
                }
                item(...arg);
            }
        }
    }
    window.Callback=Callbacks;
}(window);