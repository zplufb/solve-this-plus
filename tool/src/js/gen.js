let model_height = 8;
let model_width = 8;
let currentColor = "black";
let defaultColor = "#ffffff";
let blackArr = [];
let startArr = [];
let endArr = [];
let color2Type = {
    "black": -1,
    "#11aa11": 1,
    "#ccc0b3": 2,
    "#ffffff": 0
}

$(function() {
    $('[click-type="copy"]').each(function() {
        let clipboard = new Clipboard(this);
        clipboard.on('success', function(e) {
            // layer.msg('复制成功');
            // alert("复制成功");
           showStatus("复制成功","green");
        });
        clipboard.on('error', function(e) {
            // layer.msg('复制失败');
            // alert("复制失败");
             showStatus("复制失败","red");
        });
    });
})

function showStatus(msg,color){
     $("#status").text(msg).css("color",color);
     setTimeout(()=>{
          $("#status").text("准备就绪").css("color","black");
     },5000);
}

function changeColor(type) {
    let colorName = "black";
    if (type == -1) {
        currentColor = "black";
        colorName = "障碍物块黑色";
    } else if (type == 1) {
        currentColor = "#11aa11";
        colorName = "起始块绿色";
    } else if (type == 2) {
        currentColor = "#ccc0b3";
        colorName = "终点块灰色";
    } else {
        currentColor = defaultColor;
        colorName = "白色"
    }
    $("#currentColor").text(colorName).css("color", currentColor)
}
$(document).ready(function() {
    InitDrawMainUI();
    function InitDrawMainUI() {
        $("#left").html("");
        let table = $("<table>").appendTo($("#left"));
        for (let i = -1; i < model_height; i++) {
            let row = $("<tr>").appendTo(table);
            for (let j = -1; j < model_width; j++) {
                if (i == -1 || j == -1) {
                    if (i == -1) $("<td noflag=1 id=mtd_" + (i * model_width + j) + " style='width:20px;height:20px'>" + (j + 1) + "</td>").appendTo(row);
                    else $("<td noflag=1 id=mtd_" + (i * model_width + j) + " style='width:20px;height:20px'>" + (i + 1) + "</td>").appendTo(row)
                } else {
                    $("<td flag=0 id=mtd_" + (i * model_width + j) + " style='width:20px;height:20px'></td>").appendTo(row)
                }
            }
        }
    }
      function resetMainUI() {
        for (let i = 0; i < model_height; i++) {
            for (let j = 0; j < model_width; j++) {
                 $("#mtd_" + (i * model_width + j)).css("background-color",defaultColor).attr("flag",0);
            }
        }
    }

    $("table td").click(function() {
        if ($(this).attr("noflag") == 1) {
            return
        }
        $(this).css("background-color", currentColor).attr("flag", color2Type[currentColor])
    });
    $("#get_char_pos").click(function() {
        let html = "";
        let arr_pos = [];
        blackArr = [];
        startArr = [];
        endArr = [];
        for (let i = 0; i < model_height; i++) for (let j = 0; j < model_width; j++) {
            let idstr = i * model_width + j;
            let flag = $("#mtd_" + idstr).attr("flag");
            if (flag == -1) {
                blackArr.push(idstr)
            } else if (flag == 1) {
                startArr.push(idstr)
            } else if (flag == 2) {
                endArr.push(idstr)
            } else {}
        }
        arr_pos.push(blackArr, startArr, endArr);
        html = JSON.stringify(arr_pos)+",";
        console.log("map=", arr_pos);
        $("#result").text(html)
    });
    $("#clear_all_red").click(function() {
        init();
    });

    function init() {
        blackArr = [];
        startArr = [];
        endArr = [];
        resetMainUI();
        $("#result").text("");
    }
});