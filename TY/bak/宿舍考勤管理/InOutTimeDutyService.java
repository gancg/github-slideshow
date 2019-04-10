package com.tianyi.event.service;


import com.tianyi.event.model.InOutTimeDutyRelate;

import java.util.List;
import java.util.Map;

/**
 * Created by lenovo on 2019/3/25.
 */
public interface InOutTimeDutyService {
    /**
     * 初始化模板数据
     * @param organId
     */
    String initInOutTimeDutyTemplateByOrganId(Integer organId) throws Exception;

    /**
     *
     * @param templateId 模板ID
     * @param deviceFlag 出入标识
     * @param relateList 时间段信息
     * @return
     * @throws Exception
     */
    String updateInOutTimeDutyRelateMsg(Integer templateId,boolean deviceFlag,List<InOutTimeDutyRelate> relateList) throws Exception;

    /**
     * 查询出入时间数据
     * @param templateId
     * @return
     */
    List<InOutTimeDutyRelate> queryInOutTimeDutyRelateMsg(Integer templateId);

    /**
     * 查询出入时间设置信息
     * @param map （包括organId，peopleType,weekDay）
     * @return
     */
    Map queryInOutTimeDutyMsg(Map map);

    /**
     *复制粘贴功能
     * @param queryMap 公共查询条件（包括organId，peopleType,updateUserId）
     * @param copyDay 待复制的星期时间
     * @param pasteDay 粘贴的星期时间
     */
    String pasteModel(Map queryMap, Integer copyDay, Integer pasteDay) throws Exception;
}
