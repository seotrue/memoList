import MemoModel from './memoModel.js'
export default class Memo{
    //id, 내용 위치(드래그), 사이즈, 노출순서
    constructor(id,content,position,size,order){
        this.id = id,
        this.content = content,
        this.position =position,
        this.size = size,
        this.order = order;

        // MemoModel 인스턴스 생성
        this.MemoModel = new  MemoModel();

        // 돔을 그린다
        this.creatDOM()
       
    }

    creatDOM() {
        $('.wrap').append(`
            <div id="${this.id}" class="memo" 
            style="top:${this.position.top}px; left:${this.position.left}px; z-index:${this.order}">
                <div class="header">
                    <h1 class="blind">메모장</h1>
                    <button class="btn_close"><span class="blind">닫기</span></button>
                </div>
                <div class="content">
                    <div class="textarea"
                        contenteditable="true"
                        style="width:${this.size.width}px; height:${this.size.height}px;">
                        ${this.content}
                    </div>
                </div>
                <button class="btn_size"><span class="blind">메모장 크기 조절</span></button>
            </div>
        `)

        this.bindMemoEvent()
        this.bindInputEvent();
    }

    // // 메모 닫기 이벤트 바인딩(방법 1: 이벤트와 삭제 로직을 각각 구분)
    removeEvent = () => {
        this.MemoModel
          .removeMemo(this.id)
          .then(() => {
            $(`#${this.id}`).remove();
          })
          .catch((error) => {
            console.log("error ", error);
          });
      };
 
      
      bindMemoEvent() {
        // 삭제
        const removeArea = document.querySelector(`#${this.id} .header .btn_close`);
        removeArea.addEventListener('click',this.removeEvent.bind(this))
      
    }

    // textarea의 내용 바인딩(방법2 : 이벤트와 입력 로직을 같이 구현)
    bindInputEvent(){
        $(`#${this.id}` .content .textarea).on({
            'keyup' : (e)=>{
                this.MemoModel.findOneMemo(id)
                .then((memo)=>{ //memo 결과값
                    memo.content = e.target.innerHTML;
                    console.log(memo,'매개변수?')
                    return this.MemoModel.updateMemo(memo);
                })
            },
            'click':()=>{
                // 상단로직
            }
        })
    }
}