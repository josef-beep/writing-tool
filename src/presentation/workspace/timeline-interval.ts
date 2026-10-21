import type {TimelineInterval} from '../../application/contracts/presentation';
import {configuration,displayDate,floorDivide,type CalendarData,type DatePosition} from '../../domain/calendar';

export const TIMELINE_INTERVAL_LABELS:Record<TimelineInterval,string>={day:'Days',month:'Months',year:'Years',decade:'Decades',century:'Centuries'};

/** Convert only through the active calendar; absolute positions remain exact bigints. */
export function timelineDateAt(position:bigint,calendar:CalendarData):DatePosition{
 const yearDays=BigInt(configuration(calendar,calendar.currentVersion).actualDays),yearOffset=floorDivide(position,yearDays);
 return{calendarVersion:calendar.currentVersion,year:(BigInt(calendar.anchor.year)+yearOffset).toString(),day:(position-yearOffset*yearDays+1n).toString()};
}

export function timelinePeriod(position:bigint,interval:TimelineInterval,calendar:CalendarData):{position:bigint;end:bigint;date:DatePosition;label:string}{
 const date=timelineDateAt(position,calendar),config=configuration(calendar,calendar.currentVersion),year=BigInt(date.year),yearDays=BigInt(config.actualDays),yearStart=position-BigInt(date.day)+1n;
 if(interval==='day')return{position,end:position,date,label:displayDate(date,calendar)};
 if(interval==='month'){
  let offset=0n,ordinal=0;
  for(const element of config.elements){
   if(element.kind==='month')ordinal++;
   if(BigInt(date.day)<=offset+BigInt(element.days))return{position:yearStart+offset,end:yearStart+offset+BigInt(element.days)-1n,date:{...date,day:(offset+1n).toString()},label:`${element.name||(element.kind==='month'?`Month ${ordinal}`:'Standalone day')} / ${date.year}`};
   offset+=BigInt(element.days);
  }
  throw new Error('This calendar has no month intervals.');
 }
 const years=interval==='year'?1n:interval==='decade'?10n:100n,startYear=floorDivide(year,years)*years,start=yearStart+(startYear-year)*yearDays;
 return{position:start,end:start+years*yearDays-1n,date:{...date,year:startYear.toString(),day:'1'},label:years===1n?date.year:`${startYear}–${startYear+years-1n}`};
}

export function timelineDefaultSpan(interval:TimelineInterval,calendar:CalendarData):bigint{
 const yearDays=BigInt(configuration(calendar,calendar.currentVersion).actualDays);
 return interval==='day'?365n:interval==='month'?yearDays:interval==='year'?10n*yearDays:interval==='decade'?100n*yearDays:1000n*yearDays;
}

/** Month averaging is only a pixel scale; actual month boundaries come from timelinePeriod. */
export function timelineUnitDays(interval:TimelineInterval,calendar:CalendarData):bigint{
 const config=configuration(calendar,calendar.currentVersion),yearDays=BigInt(config.actualDays);
 if(interval==='day')return 1n;
 if(interval==='month')return yearDays/BigInt(Math.max(1,config.elements.filter(element=>element.kind==='month').length))||1n;
 return yearDays*(interval==='year'?1n:interval==='decade'?10n:100n);
}
