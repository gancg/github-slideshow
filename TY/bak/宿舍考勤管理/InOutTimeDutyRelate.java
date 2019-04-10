package com.tianyi.event.model;

import java.io.Serializable;
import java.util.Date;

/**
 * 进出时间关联表t_inOut_timeDuty_relate实体类
 * Created by lenovo on 2019/3/25.
 */
public class InOutTimeDutyRelate implements Serializable{
    //id
    private Long id;
    //固定时间模板id（属于某种类型人员某一天的考勤设置）
    private Integer templateId;
    //进出标识，1-进；0-出
    private Boolean inoutFlag;
    //开始时间
    private String dutyBeginTime;
    //结束时间
    private String dutyEndTime;
    //修改时间
    private Date updateTime;
    //修改人员ID
    private Long updateUserId;
    //下发设备标识 0-大门（false）  1-宿舍（true）
    private Boolean deviceFlag;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTemplateId() {
        return templateId;
    }

    public void setTemplateId(Integer templateId) {
        this.templateId = templateId;
    }

    public Boolean getInoutFlag() {
        return inoutFlag;
    }

    public void setInoutFlag(Boolean inoutFlag) {
        this.inoutFlag = inoutFlag;
    }

    public String getDutyBeginTime() {
        return dutyBeginTime;
    }

    public void setDutyBeginTime(String dutyBeginTime) {
        this.dutyBeginTime = dutyBeginTime == null ? null : dutyBeginTime.trim();
    }

    public String getDutyEndTime() {
        return dutyEndTime;
    }

    public void setDutyEndTime(String dutyEndTime) {
        this.dutyEndTime = dutyEndTime == null ? null : dutyEndTime.trim();
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Long getUpdateUserId() {
        return updateUserId;
    }

    public void setUpdateUserId(Long updateUserId) {
        this.updateUserId = updateUserId;
    }

    public Boolean getDeviceFlag() {
        return deviceFlag;
    }

    public void setDeviceFlag(Boolean deviceFlag) {
        this.deviceFlag = deviceFlag;
    }
}
