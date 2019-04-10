package com.tianyi.event.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tianyi.event.model.InOutTimeDutyRelate;
import com.tianyi.event.model.R;
import com.tianyi.event.service.InOutTimeDutyService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * 出入时间设置
 *
 * @author admin
 * @email tievd.com
 * @date 2019-3-25 15:04:23
 */
@RestController
@RequestMapping("/inOutTimeDuty")
@Slf4j
@Api(value = "出入时间设置")
public class InOutTimeDutyController {
    @Autowired
    private InOutTimeDutyService inOutTimeDutyService;

    @RequestMapping(path = "/saveOrUpdate", method = RequestMethod.POST)
    @ApiOperation(value="添加或修改", notes="添加或修改某种人员类型在某一天的出入时间信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "query_dic", value = "query_dic", dataType = "String", paramType = "query")
    })
    public R saveOrUpdate(String  query_dic) {
        try {
            JSONObject joQuery = JSONObject.parseObject(query_dic);
            Integer templateId=joQuery.getInteger("templateId");
            if(templateId==null||templateId<1){
                return R.error("templateId不能为空！");
            }
            Boolean deviceFlag=joQuery.getBoolean("deviceFlag");
            JSONArray relateJsonArray=joQuery.getJSONArray("relateList");
            List<InOutTimeDutyRelate> relateList=relateJsonArray.toJavaList(InOutTimeDutyRelate.class);
            String returnMsg=inOutTimeDutyService.updateInOutTimeDutyRelateMsg(templateId,deviceFlag,relateList);
            return R.ok(returnMsg);
        }catch (Exception e){
            log.error("保存数据异常:"+e.getMessage());
            return R.error("保存数据异常:"+e.getMessage());
        }
    }


    /**
     * 根据模板ID获取出入时间详情
     *
     * @param templateId
     * @return
     */
    @RequestMapping(value = "/queryInOutTimeDutyRelateMsg", method = RequestMethod.POST)
    public R queryInOutTimeDutyRelateMsg(int templateId) {
        List<InOutTimeDutyRelate> relateList=inOutTimeDutyService.queryInOutTimeDutyRelateMsg(templateId);
        return R.ok("获取成功",relateList);
    }

       /**
     * 根据条件获取出入时间数据
     *
     * @param map(包括organId,peopleType,weekDay)
     * @return
     */
    @RequestMapping(value = "/queryInOutTimeDutyMsg", method = RequestMethod.POST)
    public R queryInOutTimeDutyMsg(@RequestParam Map<String, Object> map) {
        Map returnMap=inOutTimeDutyService.queryInOutTimeDutyMsg(map);
        return R.ok("获取成功",returnMap);
    }

    /**
     * 根据机构初始化出入时间列表
     *
     * @param
     * @return
     */
    @RequestMapping(value = "/initInOutTimeDutyTemplateByOrganId", method = RequestMethod.POST)
    public R  initInOutTimeDutyTemplateByOrganId(int organId) {
        try {
            String returnMsg=inOutTimeDutyService.initInOutTimeDutyTemplateByOrganId(organId);
            return R.ok(returnMsg);
        }catch (Exception e){
            //非学校的单独处理
            if(e.getMessage().equals("NotSchool")){
                return R.error("NotSchool");
            }
            log.error("初始化出入时间列表失败："+e);
            return R.error("初始化失败，请查看后台日志！");
        }
    }


    /**
     * 出入时间设置复制粘贴功能
     * @param query_dic
     * @return
     */
    @RequestMapping(path = "/pasteModel", method = RequestMethod.POST)
    @ApiOperation(value="复制粘贴功能", notes="复制粘贴出入时间功能")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "query_dic", value = "query_dic", dataType = "String", paramType = "query")
    })
    public R pasteModel(String query_dic) {
        try {
            JSONObject jsonObject=JSONObject.parseObject(query_dic);
            Integer copyDay=jsonObject.getInteger("copyDay");
            if(copyDay==null||copyDay<1){
                return R.error("复制时间不能为空！");
            }
            Integer pasteDay=jsonObject.getInteger("pasteDay");
            if(pasteDay==null||pasteDay<1){
                return R.error("粘贴时间不能为空！");
            }
            //（包括organId，peopleType，updateUserId）
            Map queryMap=jsonObject.getJSONObject("queryMap");
            String returnMsg=inOutTimeDutyService.pasteModel(queryMap,copyDay,pasteDay);
            return R.ok(returnMsg);
        }catch (Exception e){
            log.error("粘贴出入时间失败："+e);
            return R.error(e.getMessage());
        }
    }


}
