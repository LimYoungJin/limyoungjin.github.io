const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraserBtn = document.getElementById("eraser-btn");
const colorOptions = Array.from(
    document.getElementsByClassName("color-option")
);
const color = document.getElementById("color"); //color input 가져오기
const lineWidth = document.getElementById("line-width"); // line-width 가져옴
const canvas = document.querySelector("canvas"); // html 컨버스 가져오기
// canvas에 그림을 그릴 때 필요한게 context
const ctx = canvas.getContext("2d"); //우리가 사용할 페인트 브러쉬를 2d로 쓴다

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;


// 컨버스의 가로세로 정하기
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";

// 인자 안에 x,y 좌표 가로 세로 stroke는 선만 보이고 fill은 단색으로 모양 채움
// 선을 만들고 선을 만들고 채우고
//fillRect는 fill rect를 호출함

let isPaintiong = false;
let isFilling = false;

//마우스가 움직일때 브러쉬를 움직임
function onMove(event) {
    //ispaintiong이 true일때 선을 그림 false면 조용히 브러쉬만 움직여줌ㅎ
    //beginPath로 이전에 그린선과 새로운 선의 연결을 끊어줘야함
    if (isPaintiong) {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        return;
    }
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

// 마우스가 눌렸을 때 유저가 그리고 싶어하는걸 그리게 해줌
function startPainting() {
    isPaintiong = true;
}
// 마우스가 땟을 때 그냥 아무일도 없게 함 사용자가 페인팅을 마치면
//새로운 path를 만들도록 함
function cancelPainting() {
    isPaintiong = false;
    ctx.beginPath();
}

// 붓 크기 변경
function onLineWidthChange(event) {
    ctx.lineWidth = event.target.value;
}

// 붓 색 변경
function onColorChange(event) {
    ctx.strokeStyle = event.target.value;
    ctx.fillStyle = event.target.value;
}

//색을 클릭했을때 붓 색 변경
function onColorClick(event) {
    const colorValue = event.target.dataset.color;
    ctx.strokeStyle = colorValue;
    ctx.fillStyle = colorValue;
    color.value = colorValue;
}

//btn 눌렀을 때 fill, draw 로 바꿔주기
function onModeClick() {
    if (isFilling) {
        isFilling = false
        modeBtn.innerText = "Fill"
    } else {
        isFilling = true
        modeBtn.innerText = "Draw"
    }
}

// 색 누르고 그림판에 눌렀을때 배경 색 바꿈
function onCanvasClick() {
    if (isFilling) {
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}

// destroy누르면 그림판 초기화
function onDestroyClick() {
    let destroy = confirm("그림판 지울랭?");
    if (destroy == true) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {

    }
}

//eraser 누르면 붓이 지우개가 됨
function onEraserClick() {
    ctx.strokeStyle = "white";
}

//파일 첨부한 이미지를 가져옴
function onFileChange(event) {
    const file = event.target.files[0]; //업로드한 파일 가져옴
    const url = URL.createObjectURL(file); //그 파일의 url 가져옴
    const image = new Image() // html 코드에서 <img src="" /> 쓰는것과 같은 의미
    image.src = url; //img에 url 추가
    image.onload = function () {
        //image , x, y , width, height
        ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        fileInput.value = null;
    };

}

// 컨버스에 더블클릭 할때 텍스트 나오게 하기
function onDoubleClick(event) {
    //text가 비어있다면 아무것도 하지 않음
    let f = new FontFace('text', 'url(x)');
    f.load().then(function () {

    });

    const text = textInput.value;
    if (text !== "") {
        ctx.save(); //현재 상태와 선택들을 저장 
        ctx.lineWidth = 1;
        ctx.font = "bold 48px serif" // size와 font-family를 지정하는 코드
        ctx.strokeText(text, event.offsetX, event.offsetY);
        ctx.restore(); //저장했던 상태과 선택으로 돌아감
    }
}

//그린 그림 저장
function onSaveclick() {
    const url = canvas.toDataURL(); //그린 그림을 url 로 변환해서
    const a = document.createElement("a"); // a태그를 생성
    a.href = url; //html 에서 a 태그를 생성 속성 download로 설정 하는 것과 같음<a href="" download>
    a.download = "myDrawing.png"
    a.click(); //파일 다운로드
}


canvas, addEventListener("dblclick", onDoubleClick);
//click은 눌렀다 땠을때 이벤트 발생
//mousemove는 마우스 움직일때 
//canvas.onmousemove = onMove 밑에 줄과 같은 기능 하지만 이벤트리스너가 더 쓰기 편함
canvas.addEventListener("mousemove", onMove);
//mouseDown은 마우스를 누른채로 있는 것 
canvas.addEventListener("mousedown", startPainting);
//mouseUp은 마우스를 뗐을 때
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);

//그림판안에서 클릭한후 그림판 밖으로 나가서 땟을때 다시 마우스가 돌아오면
//그림이 그려지는 버그를 해결 하는 방법은 2가지
//한가지는 //canvas.addEventListener("mouseleave", onMouseUp);로
//마우스가 떠났을 때를 감지하는것
//또다른 한가지는 document.addEventListener("mouseup", onMouseUp);로
//그림판 안에가 아닌 어디서든 마우스에서 손을 떼면 isPainting를 false로 만듬

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);
colorOptions.forEach(color => color.addEventListener
    ("click", onColorClick));
modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveclick);
