/**
 * @file 工具集
 * @module core/job/kit
 */

/**
 * 月份包含的天数
 */
export let days: number[] = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * 获取前几天的日期对象
 * @param before_day 前几天
 */
export function beforeDay(before_day: number): Date {
    let date: Date = new Date();
    let day: number = date.getDate();
    let month: number = date.getMonth();
    let year: number = date.getFullYear();

    while(before_day >= day) {
        before_day -= day;  //还需减多少天
        
        month--;
        if(month < 0) {
            month = 11; //12月
            year--;
        }

        if(month === 1) {   //二月则需判断是否闰年
            if((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
                day = days[month];
            else
                day = days[month] - 1;
        }
        else {
            day = days[month];
        }
    }

    day -= before_day;
    date.setDate(day);
    date.setMonth(month);
    date.setFullYear(year);

    return date;
}