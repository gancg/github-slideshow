package com.tianyi.event.service.impl;

import com.tianyi.event.controller.EntranceGuardController;
import com.tianyi.event.mapper.AdditionalDeviceMapper;
import com.tianyi.event.mapper.InOutTimeDutyMapper;
import com.tianyi.event.model.AdditionalDevice;
import com.tianyi.event.model.InOutTimeDutyRelate;
import com.tianyi.event.model.InOutTimeDutyTemplate;
import com.tianyi.event.service.InOutTimeDutyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by lenovo on 2019/3/25.
 */
@Service
@Transactional
public class InOutTimeDutyServiceImpl implements InOutTimeDutyService {
    @Autowired
    private InOutTimeDutyMapper inOutTimeDutyMapper;
    @Autowired
    private AdditionalDeviceMapper additionalDeviceMapper;

    @Override
    @Transactional(isolation= Isolation.SERIALIZABLE,rollbackFor = Exception.class)
    public String initInOutTimeDutyTemplateByOrganId(Integer organId) throws Exception{
        synchronized (this){
            //判断是否学校类型的机构，如果不是则返回
            int organType=inOutTimeDutyMapper.queryOrganType(organId);
            if(organType!=99){
                throw new Exception("NotSchool");
            }
            //先查询数据库中是否有模板的初始化数据
            Map queryMap=new HashMap();
            queryMap.put("organId",organId);
            List<InOutTimeDutyTemplate> templates=inOutTimeDutyMapper.queryInOutTemplateByMap(queryMap);
            if(templates!=null&&templates.size()>0){
                return "";
            }
            //初始化模板数据
            List<InOutTimeDutyTemplate> templateListForInsert=new ArrayList<>();
            //人员类型
            for (int i = 0; i <5 ; i++) {
                //星期几
                for (int j = 1; j < 8; j++) {
                    InOutTimeDutyTemplate initTemplate=new InOutTimeDutyTemplate();
                    initTemplate.setOrganId(organId);
                    initTemplate.setPeopleType((byte) i);
                    initTemplate.setWeekDay((byte) j);
                    templateListForInsert.add(initTemplate);
                }
            }
            inOutTimeDutyMapper.batchInsertTemplate(templateListForInsert);

            List<InOutTimeDutyTemplate>[] outTempList=queryInOrOutTempListInfo(organId);
            Map queryMapN=new HashMap();
            queryMapN.put("orgId",organId);
            List<AdditionalDevice> devices=additionalDeviceMapper.findByparams(queryMapN);
            if(devices==null||devices.size()==0){
                return ("时间设置成功！但该机构未绑定设备信息");
            }
            return EntranceGuardController.setAllDeviceArea(devices,outTempList);
        }
    }

    @Override
    @Transactional(isolation =Isolation.READ_COMMITTED,rollbackFor = Exception.class)
    public String updateInOutTimeDutyRelateMsg(Integer templateId,boolean deviceFlag,List<InOutTimeDutyRelate> relateList) throws Exception{
        //先删除关联表的数据
        Map delMap=new HashMap();
        delMap.put("templateId",templateId);
        delMap.put("deviceFlag",deviceFlag);
        inOutTimeDutyMapper.deleteByTemplageMap(delMap);
        //批量插入
        if(relateList!=null&&relateList.size()>0){
            inOutTimeDutyMapper.batchInsertRelate(relateList);
        }

        //时间下发设备
        InOutTimeDutyTemplate inOutTimeDutyTemplate=inOutTimeDutyMapper.queryTemplateById(templateId);
        if(inOutTimeDutyTemplate==null){
            throw new Exception("查询数据异常，亲核查入参templateId"+templateId);
        }
        List<InOutTimeDutyTemplate>[] outTempList=queryInOrOutTempListInfo(inOutTimeDutyTemplate.getOrganId());
        Map queryMap=new HashMap();
        queryMap.put("orgId",inOutTimeDutyTemplate.getOrganId());
        List<AdditionalDevice> devices=additionalDeviceMapper.findByparams(queryMap);
        if(devices==null||devices.size()==0){
            return ("时间设置成功！但该机构未绑定设备信息");
        }
        List<AdditionalDevice> downDevice=new ArrayList<>();
        String appendFlag="宿舍";
        //如果是宿舍时间设置
        if(deviceFlag){
            for (int i = 0; i <devices.size() ; i++) {
                if(devices.get(i).getBuildId()!=null&&devices.get(i).getBuildId()>0){
                    downDevice.add(devices.get(i));
                }
            }
        //大门考勤时间设置
        }else{
            appendFlag="大门";
            for (int i = 0; i <devices.size() ; i++) {
                if(devices.get(i).getBuildId()==null){
                    downDevice.add(devices.get(i));
                }
            }
        }
        if(downDevice==null||downDevice.size()==0){
            return ("时间设置成功！但该机构未绑定"+appendFlag+"设备信息");
        }
        return  EntranceGuardController.setAllDeviceArea(downDevice,outTempList);
    }

    @Override
    public List<InOutTimeDutyRelate> queryInOutTimeDutyRelateMsg(Integer templateId) {
        return inOutTimeDutyMapper.queryInOutRelateByTemplateId(templateId);
    }

    @Override
    public Map  queryInOutTimeDutyMsg(Map map) {

        List<InOutTimeDutyTemplate> inOutTimeDutyTemplateList=inOutTimeDutyMapper.queryInOutTemplateByMap(map);
        if(inOutTimeDutyTemplateList!=null&&inOutTimeDutyTemplateList.size()==1){
            Integer templateId=inOutTimeDutyTemplateList.get(0).getId();
            if(templateId==null){
                return null;
            }else{
                List<InOutTimeDutyRelate> relateList=inOutTimeDutyMapper.queryInOutRelateByTemplateId(templateId);
                    Map returnMap=new HashMap();
                    returnMap.put("templateId",templateId);
                List<InOutTimeDutyRelate> doorInRelateList=new ArrayList<>();
                List<InOutTimeDutyRelate> doorOutRelateList=new ArrayList<>();
                List<InOutTimeDutyRelate> dormitoryInRelateList=new ArrayList<>();
                List<InOutTimeDutyRelate> dormitoryOutRelateList=new ArrayList<>();
                if(relateList!=null&&relateList.size()>0){
                    for (int i = 0; i <relateList.size() ; i++) {
                        //进--1 宿舍1
                        if(relateList.get(i).getInoutFlag()&&relateList.get(i).getDeviceFlag()){
                            dormitoryInRelateList.add(relateList.get(i));
                        //进--1 大门0
                        }else if(relateList.get(i).getInoutFlag()&&(relateList.get(i).getDeviceFlag()==false)){
                            doorInRelateList.add(relateList.get(i));
                        //出--0 宿舍1
                        }else if((relateList.get(i).getInoutFlag()==false)&&relateList.get(i).getDeviceFlag()){
                            dormitoryOutRelateList.add(relateList.get(i));
                        //出--0 大门0
                        }else{
                            doorOutRelateList.add(relateList.get(i));
                        }
                    }
                }
                    returnMap.put("doorRelateIn",doorInRelateList);
                    returnMap.put("doorRelateOut",doorOutRelateList);
                    returnMap.put("dormitoryRelateIn",dormitoryInRelateList);
                    returnMap.put("dormitoryRelateOut",dormitoryOutRelateList);
                return returnMap;
            }
        }
        return null;
    }

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE,rollbackFor = Exception.class)
    public String pasteModel(Map queryMap, Integer copyDay, Integer pasteDay) throws Exception{
        //1.先删除粘贴星期时间的数据
        Map pasteMap=queryMap;
        pasteMap.put("weekDay",pasteDay);
        List<InOutTimeDutyTemplate> inOutTimeDutyTemplateListForPaste=inOutTimeDutyMapper.queryInOutTemplateByMap(pasteMap);
        if(inOutTimeDutyTemplateListForPaste==null||inOutTimeDutyTemplateListForPaste.size()!=1){
            throw new Exception("数据异常，请核查数据库！");
        }
        Integer pasteTemplateId=inOutTimeDutyTemplateListForPaste.get(0).getId();
        Map delMap=new HashMap();
        delMap.put("templateId",pasteTemplateId);
        inOutTimeDutyMapper.deleteByTemplageMap(delMap);
        //2.查询出复制星期时间的templateId
        Map copyMap=queryMap;
        copyMap.put("weekDay",copyDay);
        List<InOutTimeDutyTemplate> inOutTimeDutyTemplateListForCopy=inOutTimeDutyMapper.queryInOutTemplateByMap(pasteMap);
        if(inOutTimeDutyTemplateListForCopy==null||inOutTimeDutyTemplateListForCopy.size()!=1){
            throw new Exception("数据异常，请核查数据库！");
        }
        Integer copyTemplateId=inOutTimeDutyTemplateListForCopy.get(0).getId();
        //3.查询出复制星期时间数据，将数据修改成需要粘贴的数据后重新入表
        List<InOutTimeDutyRelate> relateList=inOutTimeDutyMapper.queryInOutRelateByTemplateId(copyTemplateId);
        if(relateList==null||relateList.size()<1){
            /*Map delMap1=new HashMap();
            delMap1.put("templateId",pasteTemplateId);
            inOutTimeDutyMapper.deleteByTemplageMap(delMap1);*/
        }else{
            List<InOutTimeDutyRelate> newInOutTimeDutyRelateList=new ArrayList<>();
            for (int i = 0; i <relateList.size() ; i++) {
                InOutTimeDutyRelate inOutTimeDutyRelateNew=relateList.get(i);
                inOutTimeDutyRelateNew.setTemplateId(pasteTemplateId);
                inOutTimeDutyRelateNew.setUpdateUserId(Long.parseLong(queryMap.get("updateUserId").toString()));
                newInOutTimeDutyRelateList.add(inOutTimeDutyRelateNew);
            }
            inOutTimeDutyMapper.batchInsertRelate(newInOutTimeDutyRelateList);
        }
        //时间下发设备
        InOutTimeDutyTemplate inOutTimeDutyTemplate=inOutTimeDutyMapper.queryTemplateById(copyTemplateId);
        if(inOutTimeDutyTemplate==null){
            throw new Exception("查询数据异常，亲核查入参templateId"+copyTemplateId);
        }
        List<InOutTimeDutyTemplate>[] outTempList=queryInOrOutTempListInfo(inOutTimeDutyTemplate.getOrganId());
        Map queryMapN=new HashMap();
        queryMapN.put("orgId",inOutTimeDutyTemplate.getOrganId());
        List<AdditionalDevice> devices=additionalDeviceMapper.findByparams(queryMapN);
        if(devices==null||devices.size()==0){
            return ("时间设置成功！但该机构未绑定设备信息");
        }
        return EntranceGuardController.setAllDeviceArea(devices,outTempList);
    }

    /**
     * 查询某一个模板ID所属机构所有时间设置信息
     * @param organId
     * @return
     * @throws Exception
     */
    public List<InOutTimeDutyTemplate>[] queryInOrOutTempListInfo(Integer organId) throws Exception{
        if(organId==null){
            throw new Exception("机构ID不能为空！");
        }
        //查询当前机构下的所有模板信息
        Map queryMap=new HashMap();
        queryMap.put("organId",organId);
        //将五种类型的数据依次查询封装，然后下发设备（进，出；进，出。。。）
        List<InOutTimeDutyTemplate>[] totalList=new ArrayList[10];
        //j代表人员类型（0-走读生；1-住校生；2-老师；3-家长；4-其它）
        for (int j = 0; j <5 ; j++) {
            List<InOutTimeDutyTemplate> inList=new ArrayList<>();
            List<InOutTimeDutyTemplate> outList=new ArrayList<>();
            queryMap.put("peopleType",j);
            List<InOutTimeDutyTemplate> inOutTimeDutyTemplates=inOutTimeDutyMapper.queryInOutTemplateByMap(queryMap);
            if(inOutTimeDutyTemplates!=null&&inOutTimeDutyTemplates.size()>0){
                for (int i = 0; i <inOutTimeDutyTemplates.size() ; i++) {
                    InOutTimeDutyTemplate inOutTimeDutyTemplateIn=inOutTimeDutyTemplates.get(i);
                    Map queryMapIn=new HashMap();
                    queryMapIn.put("templateId",inOutTimeDutyTemplateIn.getId());
                    queryMapIn.put("flag",true);
                    List<InOutTimeDutyRelate> relateListIn=inOutTimeDutyMapper.queryInOutRelateByTemplateIdAndFlag(queryMapIn);
                    inOutTimeDutyTemplateIn.setInOutTimeDutyRelates(relateListIn);
                    inList.add(inOutTimeDutyTemplateIn);
                    queryMapIn.remove("flag");
                    queryMapIn.put("flag",false);
                    List<InOutTimeDutyRelate> relateListOut=inOutTimeDutyMapper.queryInOutRelateByTemplateIdAndFlag(queryMapIn);
                    InOutTimeDutyTemplate inOutTimeDutyTemplateOut=new InOutTimeDutyTemplate();
                    inOutTimeDutyTemplateOut.setId(inOutTimeDutyTemplateIn.getId());
                    inOutTimeDutyTemplateOut.setOrganId(inOutTimeDutyTemplateIn.getOrganId());
                    inOutTimeDutyTemplateOut.setPeopleType(inOutTimeDutyTemplateIn.getPeopleType());
                    inOutTimeDutyTemplateOut.setWeekDay(inOutTimeDutyTemplateIn.getWeekDay());
                    inOutTimeDutyTemplateOut.setInOutTimeDutyRelates(relateListOut);
                    outList.add(inOutTimeDutyTemplateOut);
                }
            }
            totalList[j*2]=inList;
            totalList[j*2+1]=outList;
        }
        return totalList;
    }
}
