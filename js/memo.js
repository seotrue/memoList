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
        //this.bindInputEvent();
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

        const inputArea =  document.querySelector(`#${this.id} .content .textarea`);
        inputArea.addEventListener('keyup',this.bindInputEvent.bind(this))
      
    }

    // textarea의 내용 바인딩(방법2 : 이벤트와 입력 로직을 같이 구현)
    bindInputEvent(e){
        this.MemoModel
          .findOneMemo(this.id)
          .then((res) => {
            res.content = e.target.innerHTML;
            return this.MemoModel.updateMemo(res);
          })
          .catch((error) => {
            console.log("error ", error);
          });

        $(`#${this.id}` .content .textarea).on({
            'keyup' : (e)=>{
                console.log('되나?')
                this.MemoModel.findOneMemo(id)
                .then((memo)=>{ //memo 결과값
                    memo.content = e.target.innerHTML;
                    console.log(memo,'매개변수?')
                    return this.MemoModel.updateMemo(memo);
                })
            },
            'click': () => {
              this.setHighestOrder();
            }
          });
        }
        
        /**
         * bindRemoveEvent function
         *
         * 메모 닫기(삭제) 이벤트 바인딩
         * 메모의 x표시 누를시 닫기와 더불어 삭제 이벤트 로직 구현
         */
        bindRemoveEvent() {
          $(`#${this.identifier} .header .btn_close`).click((e) => {
            this.memoService.removeMemo(this.identifier)
              .then((result) => {
                $(`#${this.identifier}`).remove();
              })
              .catch((error) => {
                console.log("error::\n", error);
              });
          });
        }
        
        /*****************************
         *        util functions
         *****************************/
        
        /**
         * setHighestOrder function
         *
         * 현재 active DOM의 z-index를 최상위로 끌어올리는 함수
         * mousedown 이벤트가 시작되면 DOM을 최상위로 올리고 나머지의 order를 -1씩 연산하려고 했음.
         * 그러나 연산에 의한 z-index: -1이 될수도 있으며, 메모를 무한정 만드는 사용자는 없기때문에
         * 로직을 변경함. (z-index: highestOrder + 1로 변경)
         */
        setHighestOrder() {
          let promises = [
            this.memoService.findOneMemo(this.identifier),
            this.memoService.findHighestOrder()
          ];
          
          Promise.all(promises)
            .then((results) => {
              results[0].order = results[1] + 1;
              return [this.memoService.updateMemo(results[0]), results[1]];
            })
            .then((results) => {
              this.order = results[1] + 1;
              return this.memoService.findMemos();
            })
            .then((memos) => {
              memos.forEach((memo) => {
                $(`#${memo.identifier}`).css({"z-index": memo.order});
              });
            })
            .catch((error) => {
              console.log("error::\n", error);
            });
        }
        
        getInnerPositionX = (x) => {
          let screenSize = this.getScreenSize();
          
          if(x < 0) return 0;
          else if (x > screenSize.width) return screenSize.width;
          else {
            if((x + this.drag_area.offsetWidth) > screenSize.width) return (screenSize.width - this.drag_area.offsetWidth);
            else return x;
          }
        };
        
        getInnerPositionY = (y) => {
          let screenSize = this.getScreenSize();
          
          if(y < 0) return 0;
          else if (y > screenSize.height) return screenSize.height;
          else {
            if((y + this.drag_area.offsetHeight) > screenSize.height) return (screenSize.height - this.drag_area.offsetHeight);
            else return y;
          }
        };
        
        getScreenSize = () => {
          let screenSize;
          let w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;
          
          screenSize = {width: x, height: y};
          
          return screenSize;
        }
      }