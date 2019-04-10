define(['../../../../js/route'], function (route) {
    //组件
    route.component("inOutTimeDutyListinfo", {
        templateUrl: "../../view/components/duty/inOutTimeDuty/inOutTimeDutyListInfo.html",
        bindings:{
            updatetable:"&"
        },
        controllerAs:"uls",
        controller: function($scope,$rootScope) {
            layui.use('element', function(){
                var element = layui.element;
                //导航渲染（星期几）
                element.render('nav');

            });
            layui.use(['layer'], function () {
                var layer=layui.layer;
            })
            var peopleTypeInit=0,weekDayInit=1;
            var copyDay=0,templateId=0;
            var organId=localStorage.getItem("curOrganId");
            var ssUser = localStorage.getItem("seesionUser");
            var sysUser = JSON.parse(ssUser);

            //加载表格数据
            $scope.loadTable = function(peopleType, weekDay){
                //初始化点击效果（主要用于切换机构时使用）
                if(weekDay==1){
                    $(".chooseDay").removeClass("layui-this");
                    $("#monday").addClass("layui-this");
                }
                if(peopleType==0){
                    $(".peopleType").css({color:"#00C2FF"});
                    $("#perSonTypeZero").css({color:"#FF0000"});
                }
                var orgId=$("#organId").val();
                if(orgId==""||orgId==undefined){
                    orgId=organId;
                }

                //是否可编辑权限，默认不可以
                var editFla=0;
                var reList = localStorage.getItem("resourceList");
                //获得菜单权限list
                $scope.resourceData = JSON.parse(reList);
                var token = localStorage.getItem('token');
                //判断是否保存权限
                if($.inArray("/inOutTimeDuty-save", $scope.resourceData) > -1) {
                    editFla=1;
                    $(".copy2").removeClass("hidden");
                }else{
                    $(".copy2").addClass("hidden");
                }
                //判断是否有初始化模板数据，没有则新增
                $.ajax({
                    url: baseUrl + '/caseEducat-service/inOutTimeDuty/initInOutTimeDutyTemplateByOrganId',
                    type: 'post',
                    dataType: 'json',
                    sync:false,
                    headers : {'Authorization' : 'Bearer '+token},
                    data: {organId:orgId},
                    success:  function(data) {
                        if(data.code==200) {
                            $("#onMapPanel").removeClass("hidden");
                            $("#personTypeChoose").removeClass("hidden");
                            console.log(data.msg);
                        }else{
                            //非学校的不显示页面
                            if(data.msg=="NotSchool"){
                                $("#onMapPanel").addClass("hidden");
                                $("#personTypeChoose").addClass("hidden");
                                return;
                            }
                            console.log(data.msg);
                            layer.msg("初始化数据失败！");
                            return;
                        }
                    }
                })
                setTimeout(function () {
                    $.ajax({
                        url: baseUrl + '/caseEducat-service/inOutTimeDuty/queryInOutTimeDutyMsg',
                        type: 'post',
                        dataType: 'json',
                        sync:false,
                        headers : {'Authorization' : 'Bearer '+token},
                        data: {
                            "peopleType":peopleType,
                            "weekDay":weekDay,
                            "organId":orgId
                        },
                        success:  function(data) {
                            if(data.code=200){
                                //拼接脚本
                                templateId=data.data.templateId;
                                var relateInList=data.data.doorRelateIn;
                                var relateOutList=data.data.doorRelateOut;
                                if(relateOutList!=undefined&&relateInList.length>0){
                                    $("#inTimeSetDiv").empty();
                                    for(var i=0;i<relateInList.length;i++){
                                        var inLi='<li style="margin-top: 10px"><input  type="text" class="layui-input inTimeDutyBeginClass timeDutyClass" value="'+relateInList[i].dutyBeginTime+'" style="width:120px"  placeholder="开始时间"  />'+
                                            ' <span>到</span> <input  type="text" class="layui-input inTimeDutyEndClass timeDutyClass" value="'+relateInList[i].dutyEndTime+'" style="width:120px"  placeholder="结束时间" />    <span class="layui-input-inline">'+
                                            '  <i class="duty-class-add-inout" onclick="angular.element(this).scope().inTimeClassesAdd()" ></i> ';
                                        if(i==0){
                                            inLi+=' </span></li>';
                                        }else{
                                            inLi+=' <i class="duty-class-del-inout" onclick="angular.element(this).scope().inTimeClassesDel(this);"></i> </span></li>';
                                        }
                                        $("#inTimeSetDiv").append(inLi);
                                    }
                                }else{
                                    var initHtml='<li style="margin-top: 10px"><input  type="text" class="layui-input inTimeDutyBeginClass timeDutyClass" style="width:120px"  placeholder="开始时间"  />'+
                                        ' <span>到</span> <input  type="text" class="layui-input inTimeDutyEndClass timeDutyClass" style="width:120px"  placeholder="结束时间" />    <span class="layui-input-inline">'+
                                        '  <i class="duty-class-add-inout" onclick="angular.element(this).scope().inTimeClassesAdd()" ></i>  </span></li>';
                                    $("#inTimeSetDiv").html(initHtml);
                                }
                                if(relateOutList!=undefined&&relateOutList.length>0){
                                    $("#outTimeSetDiv").empty();
                                    for(var i=0;i<relateOutList.length;i++){
                                        var outLi='<li style="margin-top: 10px"><input  type="text" class="layui-input outTimeDutyBeginClass timeDutyClass" value="'+relateOutList[i].dutyBeginTime+'" style="width:120px"  placeholder="开始时间"  />'+
                                            ' <span>到</span> <input  type="text" class="layui-input outTimeDutyEndClass timeDutyClass" value="'+relateOutList[i].dutyEndTime+'" style="width:120px"  placeholder="结束时间" />   <span class="layui-input-inline">'+
                                            '  <i class="duty-class-add-inout" onclick="angular.element(this).scope().outTimeClassesAdd()" ></i>';
                                        if(i==0){
                                            outLi+=' </span></li>';
                                        }else{
                                            outLi+=' <i class="duty-class-del-inout" onclick="angular.element(this).scope().inTimeClassesDel(this);"></i> </span></li>';
                                        }
                                        $("#outTimeSetDiv").append(outLi);
                                    }
                                }else{
                                    var initHtml='<li style="margin-top: 10px"><input  type="text" class="layui-input outTimeDutyBeginClass timeDutyClass" style="width:120px"  placeholder="开始时间"  />'+
                                        ' <span>到</span> <input  type="text" class="layui-input outTimeDutyEndClass timeDutyClass" style="width:120px"  placeholder="结束时间" />   <span class="layui-input-inline">'+
                                        '  <i class="duty-class-add-inout" onclick="angular.element(this).scope().outTimeClassesAdd()" ></i> </span></li>';

                                    $("#outTimeSetDiv").html(initHtml);
                                }

                                //宿舍时间段展示
                                var relateInListDormitory=data.data.dormitoryRelateIn;
                                var relateOutListDormitory=data.data.dormitoryRelateOut;
                                if(relateInListDormitory!=undefined&&relateInListDormitory.length>0){
                                    $("#DormitoryInTimeSetDiv").empty();
                                    for(var i=0;i<relateInListDormitory.length;i++){
                                        var inLi='<li style="margin-top: 10px"><input  type="text" class="layui-input DormitoryInTimeDutyBeginClass timeDutyClass" value="'+relateInListDormitory[i].dutyBeginTime+'" style="width:120px"  placeholder="开始时间"  />'+
                                            ' <span>到</span> <input  type="text" class="layui-input DormitoryInTimeDutyEndClass timeDutyClass" value="'+relateInListDormitory[i].dutyEndTime+'" style="width:120px"  placeholder="结束时间" />    <span class="layui-input-inline">'+
                                            '  <i class="duty-class-add-inout" onclick="angular.element(this).scope().DormitoryInTimeClassesAdd()" ></i> ';
                                        if(i==0){
                                            inLi+=' </span></li>';
                                        }else{
                                            inLi+=' <i class="duty-class-del-inout" onclick="angular.element(this).scope().inTimeClassesDel(this);"></i> </span></li>';
                                        }
                                        $("#DormitoryInTimeSetDiv").append(inLi);
                                    }
                                }else{
                                    var initHtml='<li style="margin-top: 10px"><input  type="text" class="layui-input DormitoryInTimeDutyBeginClass timeDutyClass" style="width:120px"  placeholder="开始时间"  />'+
                                        ' <span>到</span> <input  type="text" class="layui-input DormitoryInTimeDutyEndClass timeDutyClass" style="width:120px"  placeholder="结束时间" />    <span class="layui-input-inline">'+
                                        '  <i class="duty-class-add-inout" onclick="angular.element(this).scope().DormitoryInTimeClassesAdd()" ></i>  </span></li>';
                                    $("#DormitoryInTimeSetDiv").html(initHtml);
                                }
                                if(relateOutListDormitory!=undefined&&relateOutListDormitory.length>0){
                                    $("#DormitoryOutTimeSetDiv").empty();
                                    for(var i=0;i<relateOutListDormitory.length;i++){
                                        var outLi='<li style="margin-top: 10px"><input  type="text" class="layui-input DormitoryOutTimeDutyBeginClass timeDutyClass" value="'+relateOutListDormitory[i].dutyBeginTime+'" style="width:120px"  placeholder="开始时间"  />'+
                                            ' <span>到</span> <input  type="text" class="layui-input DormitoryOutTimeDutyEndClass timeDutyClass" value="'+relateOutListDormitory[i].dutyEndTime+'" style="width:120px"  placeholder="结束时间" />   <span class="layui-input-inline">'+
                                            '  <i class="duty-class-add-inout" onclick="angular.element(this).scope().DormitoryOutTimeClassesAdd()" ></i>';
                                        if(i==0){
                                            outLi+=' </span></li>';
                                        }else{
                                            outLi+=' <i class="duty-class-del-inout" onclick="angular.element(this).scope().inTimeClassesDel(this);"></i> </span></li>';
                                        }
                                        $("#DormitoryOutTimeSetDiv").append(outLi);
                                    }
                                }else{
                                    var initHtml='<li style="margin-top: 10px"><input  type="text" class="layui-input DormitoryOutTimeDutyBeginClass timeDutyClass" style="width:120px"  placeholder="开始时间"  />'+
                                        ' <span>到</span> <input  type="text" class="layui-input DormitoryOutTimeDutyEndClass timeDutyClass" style="width:120px"  placeholder="结束时间" />   <span class="layui-input-inline">'+
                                        '  <i class="duty-class-add-inout" onclick="angular.element(this).scope().DormitoryOutTimeClassesAdd()" ></i> </span></li>';

                                    $("#DormitoryOutTimeSetDiv").html(initHtml);
                                }

                                //时间渲染
                                layui.use(['laydate'], function(){
                                    var laydate=layui.laydate;
                                    //时间段选择器渲染
                                    $('.timeDutyClass').each(function(){
                                        laydate.render({
                                            elem: this,
                                            type:'time',
                                            format:'HH:mm'
                                        });
                                        $(this).css({'width':'120px'});
                                        //如果有权限，则可以进行编辑否则只能查看数据
                                        if(editFla==1){
                                            $(this).attr("disabled",false);
                                        }else{
                                            $(this).attr("disabled",true);
                                        }
                                    })
                                })

                                //人员类型点击css样式
                                $(".peopleType").click(function () {
                                    $(".peopleType").css({color:"#00C2FF"});
                                    $(this).css({color:"#FF0000"});
                                })

                                //复制点击css样式
                                $(".copy2").click(function(){
                                    $(".paste2").removeClass("hidden");
                                    $(".copy2").addClass("hidden");
                                    $(this).removeClass("hidden");
                                    $(this).next().addClass("hidden");
                                });
                                //粘贴点击css样式
                                $(".paste2").click(function () {
                                    $(this).addClass("hidden");
                                });
                            }
                        }
                    });
                },100)

            }
            var inTimeClassAppend='<li style="margin-top: 10px"><input  type="text" class="layui-input inTimeDutyBeginClass timeDutyClass" style="width:120px"  placeholder="开始时间"  />'+
                ' <span>到</span> <input  type="text" class="layui-input inTimeDutyEndClass timeDutyClass" style="width:120px"  placeholder="结束时间" />    <span class="layui-input-inline">'+
                '  <i class="duty-class-add-inout" onclick="angular.element(this).scope().inTimeClassesAdd()" ></i> <i class="duty-class-del-inout" onclick="angular.element(this).scope().inTimeClassesDel(this);" ></i> </span></li>';
            //进口时间添加
            $scope.inTimeClassesAdd=function () {
                if($("#inTimeSetDiv>li").length>=6){
                    layer.msg("最大时间段个数不能超过六个！！！");
                    return;
                }
                $("#inTimeSetDiv").append(inTimeClassAppend);
                layui.use(['laydate'], function(){
                    var laydate=layui.laydate;
                    //时间段选择器渲染
                    $('.timeDutyClass').each(function(){
                        laydate.render({
                            elem: this,
                            type:'time',
                            format:'HH:mm'
                        });
                        $(this).css({'width':'120px'});
                    })
                })
            }

            var DormitoryInTimeClassAppend='<li style="margin-top: 10px"><input  type="text" class="layui-input DormitoryInTimeDutyBeginClass timeDutyClass" style="width:120px"  placeholder="开始时间"  />'+
                ' <span>到</span> <input  type="text" class="layui-input DormitoryInTimeDutyEndClass timeDutyClass" style="width:120px"  placeholder="结束时间" />   <span class="layui-input-inline">'+
                '  <i class="duty-class-add-inout" onclick="angular.element(this).scope().DormitoryInTimeClassesAdd()" ></i> <i class="duty-class-del-inout" onclick="angular.element(this).scope().inTimeClassesDel(this);" ></i> </span></li>';
            //宿舍进口时间添加
            $scope.DormitoryInTimeClassesAdd=function () {
                if($("#DormitoryInTimeSetDiv>li").length>=6){
                    layer.msg("最大时间段个数不能超过六个！！！");
                    return;
                }
                $("#DormitoryInTimeSetDiv").append(DormitoryInTimeClassAppend);
                layui.use(['laydate'], function(){
                    var laydate=layui.laydate;
                    //时间段选择器渲染
                    $('.timeDutyClass').each(function(){
                        laydate.render({
                            elem: this,
                            type:'time',
                            format:'HH:mm'
                        });
                        $(this).css({'width':'120px'});
                    })
                })
            }

            var DormitoryOutTimeClassAppend='<li style="margin-top: 10px"><input  type="text" class="layui-input DormitoryOutTimeDutyBeginClass timeDutyClass" style="width:120px"  placeholder="开始时间"  />'+
                ' <span>到</span> <input  type="text" class="layui-input DormitoryOutTimeDutyEndClass timeDutyClass" style="width:120px"  placeholder="结束时间" />   <span class="layui-input-inline">'+
                '  <i class="duty-class-add-inout" onclick="angular.element(this).scope().DormitoryOutTimeClassesAdd()" ></i> <i class="duty-class-del-inout" onclick="angular.element(this).scope().inTimeClassesDel(this);" ></i> </span></li>';

            //宿舍出口时间添加
            $scope.DormitoryOutTimeClassesAdd=function () {
                if($("#DormitoryOutTimeSetDiv>li").length>=6){
                    layer.msg("最大时间段个数不能超过六个！！！");
                    return;
                }
                $("#DormitoryOutTimeSetDiv").append(DormitoryOutTimeClassAppend);
                layui.use(['laydate'], function(){
                    var laydate=layui.laydate;
                    //时间段选择器渲染
                    $('.timeDutyClass').each(function(){
                        laydate.render({
                            elem: this,
                            type:'time',
                            format:'HH:mm'
                        });
                        $(this).css({'width':'120px'});
                    })
                })
            }

            //进出口时间删除
            $scope.inTimeClassesDel=function (obj) {
                $(obj).parent().parent().remove();
            }
            var outTimeClassAppend='<li style="margin-top: 10px"><input  type="text" class="layui-input outTimeDutyBeginClass timeDutyClass" style="width:120px"  placeholder="开始时间"  />'+
                ' <span>到</span> <input  type="text" class="layui-input outTimeDutyEndClass timeDutyClass" style="width:120px"  placeholder="结束时间" />   <span class="layui-input-inline">'+
                '  <i class="duty-class-add-inout" onclick="angular.element(this).scope().outTimeClassesAdd()" ></i> <i class="duty-class-del-inout" onclick="angular.element(this).scope().inTimeClassesDel(this);" ></i> </span></li>';
            //进口时间添加
            $scope.outTimeClassesAdd=function () {
                if($("#outTimeSetDiv>li").length>=6){
                    layer.msg("最大时间段个数不能超过六个！！！");
                    return;
                }
                $("#outTimeSetDiv").append(outTimeClassAppend);
                layui.use(['laydate'], function(){
                    var laydate=layui.laydate;
                    //时间段选择器渲染
                    $('.timeDutyClass').each(function(){
                        laydate.render({
                            elem: this,
                            type:'time',
                            format:'HH:mm'
                        });
                        $(this).css({'width':'120px'});
                    })
                })
            }
            //复制点击事件
            $scope.chooseCopyDay2=function (obj) {
                copyDay=obj;
                $("#canclePaste1").removeClass("hidden");
            }
            //粘贴点击事件
            $scope.pasteCopyDay2=function (obj) {
                var orgId=$("#organId").val();
                if(orgId==""||orgId==undefined){
                    orgId=organId;
                }
                var query_dic={
                    "copyDay":copyDay,
                    "pasteDay":obj,
                    "queryMap":{
                        "organId":orgId,
                        "peopleType":peopleTypeInit,
                        "updateUserId":sysUser.id
                    }
                }
                layer.load(3);
                $.ajax({
                    url: baseUrl + '/caseEducat-service/inOutTimeDuty/pasteModel',
                    type: 'post',
                    dataType: 'json',
                    sync:false,
                    headers : {'Authorization' : 'Bearer '+token},
                    data: {query_dic:JSON.stringify(query_dic)},
                    success:  function(data) {
                        if(data.code==200) {
                            $scope.loadTable(peopleTypeInit,weekDayInit);
                            layer.closeAll();
                            layer.alert(data.msg);
                        }else{
                            $scope.loadTable(peopleTypeInit,weekDayInit);
                            layer.close(3);
                            console.log(data.msg);
                            layer.msg("粘贴失败！");
                            return;
                        }
                    }
                })

            }

            //星期几的点击事件
            $scope.chooseDay=function (obj) {
                weekDayInit=obj;
                $scope.loadTable(peopleTypeInit,weekDayInit);
            }
            $scope.loadTable(0,1);
            //保存数据并提交
            $scope.submitInOutTimeSetForDoor=function () {
                //进口
                var submitInRelateList=new Array();
                var submitRelateOne;
                //只有一个时间段单独判断（开始结束时间可以同时为空，但不要入库）
                if($("#inTimeSetDiv>li").length==1){
                    var inTimeDutyBeginClassOne=$(".inTimeDutyBeginClass")[0].value;
                    var inTimeDutyEndClassOne=$(".inTimeDutyEndClass")[0].value;
                    if(inTimeDutyBeginClassOne==""&&inTimeDutyEndClassOne!=""){
                        layer.msg("大门进口开始时间不能为空！");
                        return;
                    }
                    if(inTimeDutyBeginClassOne!=""&&inTimeDutyEndClassOne==""){
                        layer.msg("大门进口结束时间不能为空！");
                        return;
                    }
                    if(inTimeDutyBeginClassOne!=""&&inTimeDutyEndClassOne!=""){
                        if(inTimeDutyBeginClassOne>=inTimeDutyEndClassOne){
                            layer.msg("大门进口开始时间不能大于或等于大门进口结束时间！");
                            return;
                        }
                        submitRelateOne={"inoutFlag":true,"deviceFlag":false,"dutyBeginTime":inTimeDutyBeginClassOne,"dutyEndTime":inTimeDutyEndClassOne,"updateUserId":sysUser.id,"templateId":templateId};
                        submitInRelateList.push(submitRelateOne);
                    }
                }else{
                    /*if($("#inTimeSetDiv>li").length>6){
                        layer.msg("最大时间段个数不能超过六个！！！");
                        return;
                    }*/

                    for(var i=0;i<$("#inTimeSetDiv>li").length;i++){
                        var inTimeDutyBeginClassOneLi=$(".inTimeDutyBeginClass")[i].value;
                        var inTimeDutyEndClassOneLi=$(".inTimeDutyEndClass")[i].value;
                        if(inTimeDutyBeginClassOneLi==""||inTimeDutyBeginClassOneLi==undefined){
                            layer.msg("大门进口开始时间不能为空！");
                            return;
                        }
                        if(inTimeDutyEndClassOneLi==""||inTimeDutyEndClassOneLi==undefined){
                            layer.msg("大门进口结束时间不能为空！");
                            return;
                        }
                        if(inTimeDutyBeginClassOneLi>=inTimeDutyEndClassOneLi){
                            layer.msg("大门进口开始时间不能大于或等于大门进口结束时间！");
                            return;
                        }
                        if(submitInRelateList.length>0){
                            for(var j=0;j<submitInRelateList.length;j++){
                                if((inTimeDutyBeginClassOneLi>submitInRelateList[j].dutyBeginTime)&&(inTimeDutyBeginClassOneLi<submitInRelateList[j].dutyEndTime)){
                                    layer.msg("保存失败！大门进口各个时间段之间不能有时间交叉，请核实！");
                                    return;
                                }
                                if((inTimeDutyEndClassOneLi>submitInRelateList[j].dutyBeginTime)&&(inTimeDutyEndClassOneLi<submitInRelateList[j].dutyEndTime)){
                                    layer.msg("保存失败！大门进口各个时间段之间不能有时间交叉，请核实！");
                                    return;
                                }
                                if((inTimeDutyBeginClassOneLi<=submitInRelateList[j].dutyBeginTime)&&(inTimeDutyEndClassOneLi>=submitInRelateList[j].dutyEndTime)){
                                    layer.msg("保存失败！大门进口各个时间段之间不能有时间交叉，请核实！");
                                    return;
                                }
                            }
                        }
                        submitRelateOne={"inoutFlag":true,"deviceFlag":false,"dutyBeginTime":inTimeDutyBeginClassOneLi,"dutyEndTime":inTimeDutyEndClassOneLi,"updateUserId":sysUser.id,"templateId":templateId};
                        submitInRelateList.push(submitRelateOne);
                    }
                }
                var submitOutRelateList=new Array();
                //只有一个时间段单独判断（开始结束时间可以同时为空，但不要入库）
                if($("#outTimeSetDiv>li").length==1){
                    var outTimeDutyBeginClassOne=$(".outTimeDutyBeginClass")[0].value;
                    var outTimeDutyEndClassOne=$(".outTimeDutyEndClass")[0].value;
                    if(outTimeDutyBeginClassOne==""&&outTimeDutyEndClassOne!=""){
                        layer.msg("大门出口开始时间不能为空！");
                        return;
                    }
                    if(outTimeDutyBeginClassOne!=""&&outTimeDutyEndClassOne==""){
                        layer.msg("大门出口结束时间不能为空！");
                        return;
                    }
                    if(outTimeDutyBeginClassOne!=""&&outTimeDutyEndClassOne!=""){
                        if(outTimeDutyBeginClassOne>=outTimeDutyEndClassOne){
                            layer.msg("大门出口开始时间不能大于或等于大门出口结束时间！");
                            return;
                        }

                        submitRelateOne={"inoutFlag":false,"deviceFlag":false,"dutyBeginTime":outTimeDutyBeginClassOne,"dutyEndTime":outTimeDutyEndClassOne,"updateUserId":sysUser.id,"templateId":templateId};
                        submitOutRelateList.push(submitRelateOne);
                    }
                }else{
                    /*if($("#outTimeSetDiv>li").length>6){
                        layer.msg("最大时间段个数不能超过六个！！！");
                        return;
                    }*/
                    for(var i=0;i<$("#outTimeSetDiv>li").length;i++){
                        var outTimeDutyBeginClassOneLi=$(".outTimeDutyBeginClass")[i].value;
                        var outTimeDutyEndClassOneLi=$(".outTimeDutyEndClass")[i].value;
                        if(outTimeDutyBeginClassOneLi==""||outTimeDutyBeginClassOneLi==undefined){
                            layer.msg("大门出口开始时间不能为空！");
                            return;
                        }
                        if(outTimeDutyEndClassOneLi==""||outTimeDutyEndClassOneLi==undefined){
                            layer.msg("大门出口结束时间不能为空！");
                            return;
                        }
                        if(outTimeDutyBeginClassOneLi>=outTimeDutyEndClassOneLi){
                            layer.msg("大门出口开始时间不能大于或等于大门出口结束时间！");
                            return;
                        }
                        if(submitOutRelateList.length>0){
                            for(var j=0;j<submitOutRelateList.length;j++){
                                if((outTimeDutyBeginClassOneLi>submitOutRelateList[j].dutyBeginTime)&&(outTimeDutyBeginClassOneLi<submitOutRelateList[j].dutyEndTime)){
                                    layer.msg("保存失败！大门出口各个时间段之间不能有时间交叉，请核实！");
                                    return;
                                }
                                if((outTimeDutyEndClassOneLi>submitOutRelateList[j].dutyBeginTime)&&(outTimeDutyEndClassOneLi<submitOutRelateList[j].dutyEndTime)){
                                    layer.msg("保存失败！大门出口各个时间段之间不能有时间交叉，请核实！");
                                    return;
                                }
                                if((outTimeDutyBeginClassOneLi<=submitOutRelateList[j].dutyBeginTime)&&(outTimeDutyEndClassOneLi>=submitOutRelateList[j].dutyEndTime)){
                                    layer.msg("保存失败！大门出口各个时间段之间不能有时间交叉，请核实！");
                                    return;
                                }
                            }
                        }
                        submitRelateOne={"inoutFlag":false,"deviceFlag":false,"dutyBeginTime":outTimeDutyBeginClassOneLi,"dutyEndTime":outTimeDutyEndClassOneLi,"updateUserId":sysUser.id,"templateId":templateId};
                        submitOutRelateList.push(submitRelateOne);
                    }
                }
                submitInRelateList=submitInRelateList.concat(submitOutRelateList);
                var query_dic={"templateId":templateId,"deviceFlag":false,"relateList":submitInRelateList}
                layer.load(3);
                $.ajax({
                    url: baseUrl + "/caseEducat-service/inOutTimeDuty/saveOrUpdate",
                    headers: {'Authorization': 'Bearer ' + token},
                    type: "post",
                    dataType: "json",
                    data: {query_dic: JSON.stringify(query_dic)},
                    success: function (req) {
                        if (req.code == 200) {
                            layer.closeAll();
                            $scope.loadTable(peopleTypeInit,weekDayInit);
                            layer.alert(req.msg);
                        } else {
                            layer.close(3);
                            layer.msg("保存失败！");
                            console.log(req.msg);
                            return;
                        }
                    }
                })
            }

            //保存数据并提交(宿舍时间段数据)
            $scope.submitInOutTimeSetForDormitory=function () {
                //进口
                var submitInRelateList=new Array();
                var submitRelateOne;
                //只有一个时间段单独判断（开始结束时间可以同时为空，但不要入库）
                if($("#DormitoryInTimeSetDiv>li").length==1){
                    var DormitoryInTimeDutyBeginClassOne=$(".DormitoryInTimeDutyBeginClass")[0].value;
                    var DormitoryInTimeDutyEndClassOne=$(".DormitoryInTimeDutyEndClass")[0].value;
                    if(DormitoryInTimeDutyBeginClassOne==""&&DormitoryInTimeDutyEndClassOne!=""){
                        layer.msg("宿舍进口开始时间不能为空！");
                        return;
                    }
                    if(DormitoryInTimeDutyBeginClassOne!=""&&DormitoryInTimeDutyEndClassOne==""){
                        layer.msg("宿舍进口结束时间不能为空！");
                        return;
                    }
                    if(DormitoryInTimeDutyBeginClassOne!=""&&DormitoryInTimeDutyEndClassOne!=""){
                        if(DormitoryInTimeDutyBeginClassOne>=DormitoryInTimeDutyEndClassOne){
                            layer.msg("宿舍进口开始时间不能大于或等于宿舍进口结束时间！");
                            return;
                        }
                        submitRelateOne={"inoutFlag":true,"deviceFlag":true,"dutyBeginTime":DormitoryInTimeDutyBeginClassOne,"dutyEndTime":DormitoryInTimeDutyEndClassOne,"updateUserId":sysUser.id,"templateId":templateId};
                        submitInRelateList.push(submitRelateOne);
                    }
                }else{
                    /*if($("#DormitoryOutTimeSetDiv>li").length>6){
                     layer.msg("最大时间段个数不能超过六个！！！");
                     return;
                     }*/

                    for(var i=0;i<$("#DormitoryInTimeSetDiv>li").length;i++){
                        var DormitoryInTimeDutyBeginClassOneLi=$(".DormitoryInTimeDutyBeginClass")[i].value;
                        var DormitoryInTimeDutyEndClassOneLi=$(".DormitoryInTimeDutyEndClass")[i].value;
                        if(DormitoryInTimeDutyBeginClassOneLi==""||DormitoryInTimeDutyBeginClassOneLi==undefined){
                            layer.msg("宿舍进口开始时间不能为空！");
                            return;
                        }
                        if(DormitoryInTimeDutyEndClassOneLi==""||DormitoryInTimeDutyEndClassOneLi==undefined){
                            layer.msg("宿舍进口结束时间不能为空！");
                            return;
                        }
                        if(DormitoryInTimeDutyBeginClassOneLi>=DormitoryInTimeDutyEndClassOneLi){
                            layer.msg("宿舍进口开始时间不能大于或等于宿舍进口结束时间！");
                            return;
                        }
                        if(submitInRelateList.length>0){
                            for(var j=0;j<submitInRelateList.length;j++){
                                if((DormitoryInTimeDutyBeginClassOneLi>submitInRelateList[j].dutyBeginTime)&&(DormitoryInTimeDutyBeginClassOneLi<submitInRelateList[j].dutyEndTime)){
                                    layer.msg("保存失败！宿舍进口各个时间段之间不能有时间交叉，请核实！");
                                    return;
                                }
                                if((DormitoryInTimeDutyEndClassOneLi>submitInRelateList[j].dutyBeginTime)&&(DormitoryInTimeDutyEndClassOneLi<submitInRelateList[j].dutyEndTime)){
                                    layer.msg("保存失败！宿舍进口各个时间段之间不能有时间交叉，请核实！");
                                    return;
                                }
                                if((DormitoryInTimeDutyBeginClassOneLi<=submitInRelateList[j].dutyBeginTime)&&(DormitoryInTimeDutyEndClassOneLi>=submitInRelateList[j].dutyEndTime)){
                                    layer.msg("保存失败！宿舍进口各个时间段之间不能有时间交叉，请核实！");
                                    return;
                                }
                            }
                        }
                        submitRelateOne={"inoutFlag":true,"deviceFlag":true,"dutyBeginTime":DormitoryInTimeDutyBeginClassOneLi,"dutyEndTime":DormitoryInTimeDutyEndClassOneLi,"updateUserId":sysUser.id,"templateId":templateId};
                        submitInRelateList.push(submitRelateOne);
                    }
                }
                var submitOutRelateList=new Array();
                //只有一个时间段单独判断（开始结束时间可以同时为空，但不要入库）
                if($("#DormitoryOutTimeSetDiv>li").length==1){
                    var DormitoryOutTimeDutyBeginClassOne=$(".DormitoryOutTimeDutyBeginClass")[0].value;
                    var DormitoryOutTimeDutyEndClassOne=$(".DormitoryOutTimeDutyEndClass")[0].value;
                    if(DormitoryOutTimeDutyBeginClassOne==""&&DormitoryOutTimeDutyEndClassOne!=""){
                        layer.msg("宿舍出口开始时间不能为空！");
                        return;
                    }
                    if(DormitoryOutTimeDutyBeginClassOne!=""&&DormitoryOutTimeDutyEndClassOne==""){
                        layer.msg("宿舍出口结束时间不能为空！");
                        return;
                    }
                    if(DormitoryOutTimeDutyBeginClassOne!=""&&DormitoryOutTimeDutyEndClassOne!=""){
                        if(DormitoryOutTimeDutyBeginClassOne>=DormitoryOutTimeDutyEndClassOne){
                            layer.msg("宿舍出口开始时间不能大于或等于宿舍出口结束时间！");
                            return;
                        }

                        submitRelateOne={"inoutFlag":false,"deviceFlag":true,"dutyBeginTime":DormitoryOutTimeDutyBeginClassOne,"dutyEndTime":DormitoryOutTimeDutyEndClassOne,"updateUserId":sysUser.id,"templateId":templateId};
                        submitOutRelateList.push(submitRelateOne);
                    }
                }else{
                    /*if($("#DormitoryOutTimeSetDiv>li").length>6){
                     layer.msg("最大时间段个数不能超过六个！！！");
                     return;
                     }*/
                    for(var i=0;i<$("#DormitoryOutTimeSetDiv>li").length;i++){
                        var DormitoryOutTimeDutyBeginClassOneLi=$(".DormitoryOutTimeDutyBeginClass")[i].value;
                        var DormitoryOutTimeDutyEndClassOneLi=$(".DormitoryOutTimeDutyEndClass")[i].value;
                        if(DormitoryOutTimeDutyBeginClassOneLi==""||DormitoryOutTimeDutyBeginClassOneLi==undefined){
                            layer.msg("宿舍出口开始时间不能为空！");
                            return;
                        }
                        if(DormitoryOutTimeDutyEndClassOneLi==""||DormitoryOutTimeDutyEndClassOneLi==undefined){
                            layer.msg("宿舍出口结束时间不能为空！");
                            return;
                        }
                        if(DormitoryOutTimeDutyBeginClassOneLi>=DormitoryOutTimeDutyEndClassOneLi){
                            layer.msg("宿舍出口开始时间不能大于或等于宿舍出口结束时间！");
                            return;
                        }
                        if(submitOutRelateList.length>0){
                            for(var j=0;j<submitOutRelateList.length;j++){
                                if((DormitoryOutTimeDutyBeginClassOneLi>submitOutRelateList[j].dutyBeginTime)&&(DormitoryOutTimeDutyBeginClassOneLi<submitOutRelateList[j].dutyEndTime)){
                                    layer.msg("保存失败！宿舍出口各个时间段之间不能有时间交叉，请核实！");
                                    return;
                                }
                                if((DormitoryOutTimeDutyEndClassOneLi>submitOutRelateList[j].dutyBeginTime)&&(DormitoryOutTimeDutyEndClassOneLi<submitOutRelateList[j].dutyEndTime)){
                                    layer.msg("保存失败！宿舍出口各个时间段之间不能有时间交叉，请核实！");
                                    return;
                                }
                                if((DormitoryOutTimeDutyBeginClassOneLi<=submitOutRelateList[j].dutyBeginTime)&&(DormitoryOutTimeDutyEndClassOneLi>=submitOutRelateList[j].dutyEndTime)){
                                    layer.msg("保存失败！宿舍出口各个时间段之间不能有时间交叉，请核实！");
                                    return;
                                }
                            }
                        }
                        submitRelateOne={"inoutFlag":false,"deviceFlag":true,"dutyBeginTime":DormitoryOutTimeDutyBeginClassOneLi,"dutyEndTime":DormitoryOutTimeDutyEndClassOneLi,"updateUserId":sysUser.id,"templateId":templateId};
                        submitOutRelateList.push(submitRelateOne);
                    }
                }
                submitInRelateList=submitInRelateList.concat(submitOutRelateList);
                var query_dic={"templateId":templateId,"deviceFlag":true,"relateList":submitInRelateList}
                layer.load(3);
                $.ajax({
                    url: baseUrl + "/caseEducat-service/inOutTimeDuty/saveOrUpdate",
                    headers: {'Authorization': 'Bearer ' + token},
                    type: "post",
                    dataType: "json",
                    data: {query_dic: JSON.stringify(query_dic)},
                    success: function (req) {
                        if (req.code == 200) {
                            layer.closeAll();
                            $scope.loadTable(peopleTypeInit,weekDayInit);
                            layer.alert(req.msg);
                        } else {
                            layer.close(3);
                            layer.msg("保存失败！");
                            console.log(req.msg);
                            return;
                        }
                    }
                })
            }

            //更新表格数据
            $rootScope.$on('updateTimeDutyInOutList',function(e,param){
                peopleTypeInit=param.peopleType;
                weekDayInit=param.weekDay;
                $scope.loadTable(peopleTypeInit,weekDayInit);
            });
            $rootScope.$on('updateTimeDutyInOutListByPersonType',function(e,param){
                peopleTypeInit=param.peopleType;
                $scope.loadTable(peopleTypeInit,weekDayInit);
            });
        }
    });
});