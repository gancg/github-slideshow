package com.tianyi.event.mapper;
import com.tianyi.event.model.InOutTimeDutyRelate;
import com.tianyi.event.model.InOutTimeDutyTemplate;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface InOutTimeDutyMapper {

    int deleteByTemplageMap(Map delMap);

    InOutTimeDutyTemplate queryTemplateById(Integer templateId);

    List<InOutTimeDutyRelate> queryInOutRelateByTemplateId(Integer templateId);

    List<InOutTimeDutyRelate> queryInOutRelateByTemplateIdAndFlag(Map map);

    List<InOutTimeDutyTemplate>  queryInOutTemplateByMap(Map map);

    int batchInsertTemplate(List<InOutTimeDutyTemplate> inOutTimeDutyTemplateList);

    int batchInsertRelate(List<InOutTimeDutyRelate> inOutTimeDutyRelateList);

    int queryOrganType(Integer organId);

}