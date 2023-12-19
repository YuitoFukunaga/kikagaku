const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasX = 1200;
const canvasY = 630;
let BackGroundColor = "#000000";//背景の色
let FillColor = "#000000";//図形の色
let draw_size = 0;//図形の大きさ1%~100%
let space_rate = 0;//余白を入れる確率0~100%
let start_x = 0;//x座標のスタート地点(キレイに収めるために使用)
let start_y = 0;//start_xと同じ
let draw_selection = ""//どの形で描くか
var draw_log = [];//描画を記録しておく二次元配列

//設定を読み込むための関数
const setup = () => {
    console.log("-----setup()-----");
    var element = document.getElementById("input_BackGroundColor");
    BackGroundColor = element.value;
    console.log("BaclGroundColor : "+BackGroundColor);
    var element = document.getElementById("input_FillColor");
    FillColor = element.value;
    console.log("FillColor : "+FillColor);
    var element = document.getElementById("draw_size");
    draw_size = canvasX * (element.value/100);
    console.log("draw_size : "+draw_size);
    var element = document.getElementById("space_rate");
    space_rate = element.value;
    console.log("space_rate : "+space_rate+" %");
    var element = document.getElementsByName("draw_selection");
    for(var i = 0;i < element.length;i++){
        if(element[i].checked){
            draw_selection = element[i].value;
            console.log("draw_selection : " + element[i].value);
            break;
        }
    }

    start_x = (canvasX % draw_size)/2;
    console.log("start_x : "+start_x);
    start_y = (canvasY % draw_size)/2;
    console.log("start_y : "+start_y);
}




/*-----描画系処理-----*/

//パスリセット
const path_reset = () => {
    ctx.beginPath();
}

//背景色の描画処理
const draw_Backgroundcolor = () => {
    ctx.fillStyle = BackGroundColor;
    ctx.fillRect(0,0,canvasX,canvasY);
}

//円の描画
const draw_circle = (x,y) => {
    color_change();
    ctx.arc(x+(draw_size/2), y+(draw_size/2), draw_size/2, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
}

//三角形の描画
//きれいな三角形にならない問題 <-解決
const draw_triangle = (x,y) => {
    color_change();
    var h = (Math.sqrt(3)/2*draw_size);//高さ   
    ctx.moveTo(x+(draw_size/2), y);
    ctx.lineTo(x+draw_size, y+h);
    ctx.lineTo(x, y+h);
    ctx.fill();
}

//正方形の描画
const draw_square = (x,y) => {
    color_change();
    ctx.fillRect(x,y,draw_size,draw_size);
}

//色の変更
const color_change = () => {
    ctx.fillStyle = FillColor;
    ctx.strokeStyle = FillColor;
}

//canvasのリセット
const canvas_clear = () => {
    ctx.clearRect(0,0,canvasX,canvasY);
}
/*--------------------*/

//描画を記録しておく処理
//f = 空白か空白じゃないか(1:空白,0:空白ではない)
const draw_log_f = (f) =>{
    draw_log.push(f);
}

//描画記録配列を初期化
const draw_log_clear = () => {
    draw_log.splice((-1*draw_log.length));
    console.log(draw_log);
}

//描画処理(create)
const create_draw = () => {
    draw_Backgroundcolor();
    for(var y = start_y;y <= canvasY-draw_size;y += draw_size){
        for(var x = start_x;x <= canvasX-draw_size;x += draw_size){
            var r = Math.random()*101;
            //console.log(r);
            if(space_rate < r){
                path_reset();
                switch(draw_selection){
                    case "Circle":
                        draw_circle(x,y);
                        break;
                    case "Triangle":
                        draw_triangle(x,y);
                        break;
                    case "Square":
                        draw_square(x,y);
                        break;
                }
                draw_log_f(0);
            }else{
                draw_log_f(1);
            }
        }
    }
}


//----------------------------------------------------------------------//


//描画処理(change)
const change_draw = () =>{
    draw_Backgroundcolor();
    var c = 0;
    for(var y = start_y;y <= canvasY-draw_size;y += draw_size){
        for(var x = start_x;x <= canvasX-draw_size;x += draw_size){
            if(draw_log[c] == 0){
                path_reset();
                switch(draw_selection){
                    case "Circle":
                        draw_circle(x,y);
                        break;
                    case "Triangle":
                        draw_triangle(x,y);
                        break;
                    case "Square":
                        draw_square(x,y);
                        break;
                }
            }
            c++;
        }
    }
}

//作成ボタンが押されたときの処理
function create(){
    setup();
    canvas_clear();
    draw_log_clear();
    create_draw();
    console.log(draw_log);
}

//変更ボタンが押されたとき
function change(){
    setup();
    canvas_clear();
    change_draw();
}
