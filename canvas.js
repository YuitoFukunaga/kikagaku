const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasX = 1200;
const canvasY = 630;
let BackGroundColor = "#000000";//背景の色
let FillColor = "#000000";//図形の色
let draw_size = 0;//図形の大きさ1%~100%
let space_rate = 0;//余白を入れる確率0~100%
let sub_rate = 0;//サブの図形を入れる確率0%~100%
let size_change_scale = 0;//大きさをどのくらい変化させるか
let color_change_scale = 0;//色をどれだけ変化させるか
let start_x = 0;//x座標のスタート地点(キレイに収めるために使用)
let start_y = 0;//start_xと同じ
let draw_selection = ""//どの形で描くか
var draw_log = [];//描画を記録しておく配列










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
    var element = document.getElementById("sub_rate");
    sub_rate = element.value;
    console.log("sub_rate : "+sub_rate+" %");
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
    var element = document.getElementById("size_change_scale");
    size_change_scale = element.value;
    console.log("size_change_scale : "+size_change_scale);
    var element = document.getElementById("color_change_scale");
    color_change_scale = element.value;
    console.log("color_change_scale : "+color_change_scale);
}

const draw_size_reset = () => {
    var element = document.getElementById("draw_size");
    draw_size = canvasX * (element.value/100);
}










/*-----描画系処理-----*/

//パスリセット
const path_reset = () => {
    ctx.beginPath();
}

//canvasのリセット
const canvas_clear = () => {
    ctx.clearRect(0,0,canvasX,canvasY);
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

//サイズの変更
const size_change = () => {
    var r = Math.floor(Math.random()*size_change_scale);
    r = 1 + (r/100);//百分率に変換
    draw_size = draw_size/r;

    //console.log(draw_size);
}

/*-----描画系処理-----*/










/*-----色系処理-----*/
//カラーコード->RGB値
const transform_colorcode_to_rgb = (colorcode) =>{
    var rgb = [];//rgb値を保管しておく配列
    colorcode = colorcode.slice(1);//#を切り取り

    rgb.push(colorcode.slice(0,2));//R
    rgb.push(colorcode.slice(2,4));//G
    rgb.push(colorcode.slice(4,6));//B

    for(var rgb_i = 0;rgb_i < rgb.length;rgb_i++){
        rgb[rgb_i] = parseInt(rgb[rgb_i],16);//16進数から10進数へ
    }

    return(rgb);
}

//RGB値->カラーコード
const transform_rgb_to_colorcode = (rgb) =>{
    var colorcode = "#";//変換後のカラーコードを保管する変数

    for(rgb_i = 0;rgb_i < rgb.length;rgb_i++){
        rgb[rgb_i] = rgb[rgb_i].toString(16);

        //1桁だった場合2桁に変換しないと行けない

        if(rgb[rgb_i].length == 1){
            rgb[rgb_i] = "0"+rgb[rgb_i];
        }
        colorcode += rgb[rgb_i];
    }

    return(colorcode);
}

//色の変更
const color_change = () => {
    var rgb = transform_colorcode_to_rgb(FillColor);//カラーコードをrgb値に変換
    for(rgb_i = 0;rgb_i < rgb.length;rgb_i++){
        var r = Math.random()*color_change_scale-(color_change_scale/2);
        rgb[rgb_i] = Math.floor(rgb[rgb_i] + r);
        if(rgb[rgb_i] > 255){//255より大きくなった時調整
            rgb[rgb_i] = 255;
        }else if(rgb[rgb_i] < 0){//0より小さくなった時調整
            rgb[rgb_i] = 0;
        }
    }
    //console.log(rgb);
    FillColor = transform_rgb_to_colorcode(rgb);//rgb値をカラーコードに変換

    //console.log(FillColor);
    ctx.fillStyle = FillColor;
    ctx.strokeStyle = FillColor;
}

/*-----色系処理-----*/










/*-----記録処理-----*/

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

/*-----記録処理-----*/










/*-----描画処理-----*/

//描画処理(create)
const create_draw = () => {
    draw_Backgroundcolor();
    for(var y = start_y;y <= canvasY-draw_size;y += draw_size){
        for(var x = start_x;x <= canvasX-draw_size;x += draw_size){
            var r = Math.random()*101;//0-100
            //console.log(r);
            if(space_rate < r){
                path_reset();
                //draw_size_reset();for文の外に追加した二つ(※1)をコメントアウトしてこの文をコメントじゃないようにして実行した結果もよかった。
                size_change();
                var r = Math.random()*101;//0-100
                if(sub_rate < r){
                    main_draw(x,y);
                }else{
                    sub_draw(x,y);
                }
                draw_log_f(0);
            }else{
                draw_log_f(1);
            }
            draw_size_reset();//※1
        }
        draw_size_reset();//※1
    }
}

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
            draw_size_reset();
        }
        draw_size_reset();
    }
}

//選択されている図形を描画
const main_draw = (x,y) => {
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

//選択されていない図形を描画
const sub_draw = (x,y) => {
    var r = Math.random()*2;//0~1の乱数を生成
    r = Math.floor(r);

    //形が増えたときに処理が複雑になるからもう少し最適化できそう？
    switch(draw_selection){
        case "Circle":
            if(r == 0){
                draw_triangle(x,y);
            }else{
                draw_square(x,y);
            }
            break;
        case "Triangle":
            if(r == 0){
                draw_square(x,y);
            }else{
                draw_circle(x,y);
            }
            break;
        case "Square":
            if(r == 0){
                draw_circle(x,y);
            }else{
                draw_triangle(x,y);
            }
            break;
    }
}

/*-----描画処理-----*/










/*-----ボタン処理-----*/

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

/*-----ボタン処理-----*/