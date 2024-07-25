package com.backend.service.event;

import com.backend.mapper.event.EventMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Description;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class EventService {
    private final EventMapper eventMapper;

    public Integer getEvent(String item, Integer customerId) {
        if(item.equals("stamp")){
            return eventMapper.selectStampByCustomerId(customerId);
        } else
            return eventMapper.selectCouponByCustomerId(customerId);
    }

    public Boolean checkItem(String item) {
        return item.equals("stamp") || item.equals("coupon");
    }

    @Description("스탬프/쿠폰 발급 및 알림 추가")
    public void addStamp(Integer customerId, Integer totalCount){
        eventMapper.insertStamp(customerId, totalCount);
        Integer stampCount = eventMapper.selectStampByCustomerId(customerId);
        if(stampCount > 9){
            Integer newCouponCount = stampCount / 10;
            Integer restStampCount = stampCount % 10;
            eventMapper.updateCoupon(customerId, newCouponCount);
            eventMapper.insertNotice(customerId, "coupon", "쿠폰이 " + newCouponCount + "개 적립되었습니다.");
            if(restStampCount > 0){
                eventMapper.updateStamp(customerId, restStampCount);
                eventMapper.insertNotice(customerId, "stamp", "스탬프가 " + restStampCount + "개 적립되었습니다");
            } else {
                eventMapper.deleteStamp(customerId);
            }
        }
    }
}
