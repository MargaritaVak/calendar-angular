import { Component } from '@angular/core';

export class CalendarDay {
  public date: Date;
  public title!: string;
  public event!:string;
  public isPastDate: boolean;
  public isToday: boolean;

  constructor(d: Date) {
    this.date = d;
    this.isPastDate = d.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
    this.isToday = d.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
  }

}

const calendarData= [
  {
    date: new Date(2023, 6, 9),
    title: 'Напиться!',
    event: 'Витя Костин, Петр Михайлов.',
  },
  {
    date: new Date(2023, 6, 22),
    title: 'ДР!',
    event: 'Дима Молодцов',
  },

];

// @ts-ignore
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'calendarTask';
  public calendar: CalendarDay[] = [];
  public monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];
  public displayMonth!: string;
  private monthIndex: number = 0;

  ngOnInit() {
    this.generateCalendarDays(this.monthIndex);
  }

  private generateCalendarDays(monthIndex: number): void {
    this.calendar = [];
    let day: Date = new Date(new Date().setMonth(new Date().getMonth() + monthIndex));
    this.displayMonth = this.monthNames[day.getMonth()];
    let startingDateOfCalendar = this.getStartDateForCalendar(day);
    let dateToAdd = startingDateOfCalendar;

    for (let i = 0; i < 35; i++) {
      let calendarDay = new CalendarDay(new Date(dateToAdd));
      const dataForDate = calendarData.find(
        data => data.date.toDateString() === calendarDay.date.toDateString()
      );
      if (dataForDate) {
        calendarDay.title = dataForDate.title;
        calendarDay.event = dataForDate.event;
      }
      this.calendar.push(calendarDay);
      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
    }
  }
  private getStartDateForCalendar(selectedDate: Date){
    let lastDayOfPreviousMonth = new Date(selectedDate.setDate(1));
    let startingDateOfCalendar: Date = lastDayOfPreviousMonth;
    if (startingDateOfCalendar.getDay() != 1) {
      do {
        startingDateOfCalendar = new Date(startingDateOfCalendar.setDate(startingDateOfCalendar.getDate() - 1));
      } while (startingDateOfCalendar.getDay() != 1);
    }

    return startingDateOfCalendar;
  }


  public increaseMonth() {
    this.monthIndex++;
    this.generateCalendarDays(this.monthIndex);
  }

  public decreaseMonth() {
    this.monthIndex--
    this.generateCalendarDays(this.monthIndex);
  }

  public setCurrentMonth() {
    this.monthIndex = 0;
    this.generateCalendarDays(this.monthIndex);
  }
}
