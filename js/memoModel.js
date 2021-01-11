export default class MemoModel {
    constructor(){
         // localStorage에 있는 메모리스트
        this.storageMemo = null;
    }

     /*
        init function
        MemoManage에서 관리하는 storageMemoList 데이터 초기화
    */
    init(){
        this.storageMemo == localStorage.memos;

        (!this.storageMemo) ?
        localStorage.memos = JSON.stringify([]):
        this.storageMemo = this.parsingMemos();
    }
    /**
	 * parsingMemos function
	 * 메모리스트를 localStorage에서 가져오는 function
	 */
    parsingMemos(){
        return localStorage.memos ? JSON.parse(localStorage.memos) :null
    }

    /**
	 * createMemo function
	 *
	 * 메모를 만드는 function
	 
	 */
    createMemo = (memo) => new Promise((resolve,reject)=>{
        this.storageMemo = this.parsingMemos();
        this.storageMemo.push(memo);
        localStorage.memos = JSON.stringify(this.storageMemo)
        resolve();
    })

    /* 
    findHighestOrder function
    가장 높은 순서로 가져 오는것
    */
   // premise로 하면 해당 함수 를 부른후 then으로 콜백처리 가능
    findHighestOrder =  () => new Promise((resolve,reject)=>{
        this.storageMemo = this.parsingMemos();
        let hightOrder = 0;
        if(this.storageMemo !== 0){
            // apply이용해서 배열 받아들이고(최대값, 리스트)
            hightOrder = Math.max.apply(Math, this.storageMemo.map((memo)=>memo.order))
    
        }
        resolve(hightOrder);
    })

    /*
    메모의 인덱스를 가져오는 function
    findIndexMemo function
    */
   findIndexMemo = (id) =>{
        this.storageMemo = this.parsingMemos();
        return this.storageMemo.findIndex((memo)=> memo.id === id)

       
   }

   /*
   하나의 메모를 가져오는 function
   findOneMemo function
   */
  findOneMemo = (id) => new Promise((resolve, reject)=>{
    this.storageMemo = this.parsingMemos();
    resolve(this.storageMemo.find((memo)=>memo.id === id))
    
  })

   /*
   메모를 삭제하는 function
   removeMemo function
   */
     removeMemo = (id) => new Promise((resolve, reject) => {
        this.storageMemo = this.parsingMemos();
        const removeMemo = this.storageMemo.filter((v)=> v.id !== id)
   
        localStorage.setItem("memos", JSON.stringify(removeMemo));
        resolve();
    })

    /*
   메모를 업데이트 function
   removeMemo function
   */
    updateMemo = (memo) =>new Promise((resolve,reject)=>{
        this.storageMemo = this.parsingMemos();
        const index = this.findIndexMemo(memo.id); // 리턴한 id(현재 작성 한 메모)
        
        this.storageMemo[index] = memo;
        //localStorage.memos = JSON.stringify( this.storageMemo);
       localStorage.setItem("memos", JSON.stringify(this.storageMemo));
		
		resolve();
    })

    

    
}