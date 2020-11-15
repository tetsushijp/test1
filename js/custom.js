// Drag OJBをFabric インスタンス化し配置する
function AddInstance(im, txt, x, y, size, name_updatable,idx) {
  var dragInstance;
  fabric.Image.fromURL(im, function (img) {
    // Imageの設定
    img.scale(1).set({ width: size, height: size, originX: 100, angle: 0 });
    // text追加
    var text = new fabric.Text(txt, {
      fontSize: g_icon_size / 3,
      originX: 100,
    });
    text.set({fill: '#fff'});
    //  var circle = new fabric.Circle({radius:100, fill:"#eef",scaleY:1.1})

    // これが実際に配置さえるオブジェクト
    dragInstance = new fabric.Group([img, text], {
      left: x - (size - 50) / 2,
      top: y - (size - 50) / 2,
      angle: 0,
    });
    dragInstance.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
      bl: false,
      br: false,
      tl: false,
      tr: false,
      mtr: true,
    });
    dragInstance.hasBorders = false;
    dragInstance.cornerSize = 25;
    dragInstance.cornerColor = "#EEEEEE";
    //    dragInstance.borderColor = '#FF0000';
    dragInstance.enableRetinaScaling = true;
    dragInstance.imageSmoothingEnabled = true;
    //    g_can.add(img).setActiveObject(img);
    g_can.add(dragInstance); // グローバル変数のキャンバスに配置する
    g_can.renderAll();
    g_instance = dragInstance; // just for debug
    if (name_updatable) {g_instance_array[idx]=(dragInstance);console.log("refresh_ins_arr:");console.log(dragInstance.item(1));}
  });
}

function drawPlayers() {
  var savedMemberList = JSON.parse(localStorage.getItem("member-list"));
  if (!savedMemberList) savedMemberList = new Array(20).fill("");

  var field_padding = window.innerHeight/10;// field_rect.height / 10; // 描画開始時のpadding
  var icon_num = 6;
  var icon_sz = (window.innerHeight - field_padding * 2) / icon_num / 1.5; //サッカー場の横幅に10人並ぶぐらいの大きさ
  g_icon_size = icon_sz;
  console.log("SSS -- Icon Size (x,y):"+icon_sz);

  var init_x = 10; //field_rect.width/2;
  var init_y = 15; // + field_padding;
  var sz = icon_sz + 10;
  var memImg = "img/hito_red-tate.png";
  //      for (var i in members) {
  for (var i in savedMemberList) {
    console.log(
      "i:" +
        i +
        " savedMemberL:" +
        savedMemberList[i] +
        " " +
        g_member_drawed[i]
    );
    if (g_member_drawed[i]) {
      // 選手名があれば上書き、なければ削除
      if (savedMemberList[i]) {
        // 文字を上書き
        console.log("instance i:"+i+" name:"+savedMemberList[i]);
        g_instance_array[i].item(1).set({ text: savedMemberList[i] });
        g_can.renderAll();
      } else {
        g_can.remove(g_instance_array[i]);
        g_member_drawed[i] = false;
        continue;
      }
    }
    // まだ描画されてないメンバーの場合
    if (!g_member_drawed[i] && savedMemberList[i]) {
      console.log("描画addIns:"+savedMemberList[i]);
      var inst = AddInstance(
        memImg,
        savedMemberList[i],
        init_x + i * sz - Math.floor(i / icon_num) * icon_num * sz,
        init_y + Math.floor(i / icon_num) * sz,
        icon_sz,
        true,
        i
      );
      //console.log(inst);
      //g_instance_array.push(1);
      g_member_drawed[i] = true;
    } else continue;
    //  AddInstance(members[i].img,members[i].txt,members[i].x,members[i].y,members[i].sz);
  } // end for
  if (!g_ball_drawed) {
    AddInstance("img/ball_big.png", "", 200, 200, icon_sz / 2, false,21);
    g_ball_drawed = true;
  }
}
function save() {
  console.log("save");
  console.log("length:" + $("#member_list").find(".player-name").length);
  var len = $("#member_list").find(".player-name").length;
  g_member_array = new Array(); // 初期化
  for (var i = 0; i < len; i++) {
    var player_name = $("#member_list").find(".player-name")[i].value;
    console.log("player-name:" + player_name);
    g_member_array.push(player_name);
  }
  localStorage.setItem("member-list", JSON.stringify(g_member_array));

  console.log("----- getItem --- ");
  console.log(JSON.parse(localStorage.getItem("member-list")));
  $("#menu-check").removeAttr("checked").prop("checked", false).change();
  window.scrollTo(0, 0);
  drawPlayers();
}
var cursorFocus = function(elem) {
    var x = window.scrollX, y = window.scrollY;
    elem.focus();
    window.scrollTo(x, y);
}

function showMemberListForm() {
  var savedMemberList = JSON.parse(localStorage.getItem("member-list"));
  if (!savedMemberList) savedMemberList = new Array(20).fill("");

  for (var counter = 1; counter <= 10; counter++) {
    var newTextBoxDiv = $(document.createElement("div")).attr(
      "id",
      "TextBoxDiv" + counter
    );

    newTextBoxDiv
      .after()
      .html(
        counter+'.<input type="text" class="player-name" name="textbox' +
          counter +
          '" id="textbox' +
          counter +
          '" value="' +
          savedMemberList[counter - 1] +
          '" onblur="javascript:window.scrollTo(0, 0);" >'
      );
//    cursorFocus(newTextBoxDiv.focus);    
    newTextBoxDiv.appendTo("#member_list");
    
  }
}


// ----------------------------------------------//
// ----------------------------------------------//
// ############# ここが最初に呼ばれる ############## //
// g_instance.item(1).set({text:'hello'});
var g_can, g_icon_size, g_instance;
var g_instance_array = new Array(21); // 20 + 1 ２１はボールよう
var g_member_array = new Array();
var g_member_drawed = new Array(20).fill(false);
var g_ball_drawed = false;
var field_rect;

$(document).ready(function () {
  showMemberListForm();

  // var field_rect = document.querySelector("#fld").getBoundingClientRect()
  // $('#c').get(0).width=field_rect.width; //  1100;//$(window).width()-150;
  // $('#c').get(0).height=field_rect.height; // 700;//$(window).height()-30;
  field_rect = document.querySelector("body").getBoundingClientRect();
  $("#c").get(0).width = window.innerWidth;// field_rect.width; //  1100;//$(window).width()-150;
  $("#c").get(0).height = window.innerHeight;//field_rect.height; // 700;//$(window).height()-30;

  g_can = new fabric.Canvas("c");
  var zidx = 100;
  g_can.on("mouse:over", function (e) {
    e.target.moveTo(zidx++);
  }); //can.renderAll();

  //drawPlayers();

  $(window).resize(function () {
    // console.log(" window resize Fld Ht:"+$("#fld").height());
    // console.log(" window resize CAN Ht:"+g_can.height);

    //        if (g_can.height != $("#fld").height()) {
    if (true) {
      var scaleMultiplier = $("#fld").height() / g_can.height; // TODO:調整
      var objects = g_can.getObjects();
      for (var i in objects) {
        objects[i].scaleX = objects[i].scaleX * scaleMultiplier;
        objects[i].scaleY = objects[i].scaleY * scaleMultiplier;
        objects[i].left = objects[i].left * scaleMultiplier;
        objects[i].top = objects[i].top * scaleMultiplier;
        objects[i].setCoords();
      }

      g_can.setWidth(g_can.getWidth() * scaleMultiplier);
      g_can.setHeight(g_can.getHeight() * scaleMultiplier);
      g_can.renderAll();
      g_can.calcOffset();

      // canvasサイズもリサイズ
      //                    var field_rect = document.querySelector("body").getBoundingClientRect();
      // console.log("body w:"+field_rect.width);
      // $('#c').get(0).width=field_rect.width; //  1100;//$(window).width()-150;
      // $('.upper-canvas').get(0).width=field_rect.width;
      // $('#c').get(0).height=field_rect.height; // 700;//$(window).height()-30;
      // $('.upper-canvas').get(0).width=field_rect.width;
    }
  });
});
// TODO:
// ----------------------------------------------------------------------------
// Dragエリアは廃止して、あらかじめ人の名前が入った人が配置sれているモード作っておく。
// 文字をいれられるように
// 状態を保存できるように
// コートを最大限広くして、部品を右側に持ってくる
//
