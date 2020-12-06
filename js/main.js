import Memo from './memo.js';
import MemoModel from './memoModel.js';

let memoeModel;

document.addEventListener('DOMContentLoaded',()=>{
    memoeModel = new MemoModel();
    memoeModel.init();
    bindBackgroundEvent();
})
/*
 bindBackgroundEvent
 바탕화면 마우스 우클릭 이벤트
*/

const bindBackgroundEvent = () =>{
    let wrap = document.getElementsByClassName("wrap")[0];
    wrap.addEventListener('contextmenu',(e)=>{
        // 타 이벤트 중복 trigger 방지
        if(e.target !== e.currentTarget) return
        e.preventDefault();
        memoeModel.findHighestOrder().then((order)=>{
             //id, 내용 위치(드래그), 사이즈, 노출순서
          
            const memo = new Memo(`memo_${order + 1}`,
                '',
                {top: e.pageY, left: e.pageX},
                {width: 200, height: 100}, order + 1
             );
           return memoeModel.createMemo({
                id: memo.id, content: memo.content, position: memo.position, size: memo.size, order: memo.order
            });
            
        })
       
    })
}