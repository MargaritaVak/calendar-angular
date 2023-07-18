import { Component } from '@angular/core';

export class CalendarDay {
  public date: Date;
  public title!: string;
  public event!:string;
  public description!:string;
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
  showPopover: boolean = false;
  selectedDay: CalendarDay | undefined;
  showEventForm: boolean = false;
  inputValue: string = '';
  inputValue2: string = '';
  inputValue3: string = '';
  inputValue4: string = '';
  searchValue:string='';
  searchResults: any[] = [];


  togglePopover() {
    this.showPopover = !this.showPopover;
  }

  togglePopove2() {
    this.showEventForm = !this.showEventForm;
  }

  saveInput() {
    const newEntry = {
      date: this.inputValue,
      title: this.inputValue2,
      event: this.inputValue3
    };

    const existingEntries = JSON.parse(localStorage.getItem('entries') || '[]');
    existingEntries.push(newEntry);
    localStorage.setItem('entries', JSON.stringify(existingEntries));

    console.log('New entry saved:', newEntry);
    this.togglePopover();
    window.location.reload();
  }

  ngOnInit() {
    this.generateCalendarDays(this.monthIndex);
  }

  private generateCalendarDays(monthIndex: number): void {
    this.calendar = [];
    let day: Date = new Date(new Date().setMonth(new Date().getMonth() + monthIndex));
    this.displayMonth = this.monthNames[day.getMonth()];
    let startingDateOfCalendar = this.getStartDateForCalendar(day);
    let dateToAdd = startingDateOfCalendar;
    const entries = JSON.parse(localStorage.getItem('entries') || '[]');

    for (let i = 0; i < 35; i++) {
      let calendarDay = new CalendarDay(new Date(dateToAdd));
      const dataForDateLocal = calendarData.find(
        data => data.date.toDateString() === calendarDay.date.toDateString()
      );
      if (dataForDateLocal) {
        calendarDay.title = dataForDateLocal.title;
        calendarDay.event = dataForDateLocal.event;
      }
      const dataForDate = entries.find(
        (data: any) => new Date(data.date).toDateString() === calendarDay.date.toDateString()
      );
      if (dataForDate) {
        calendarDay.title = dataForDate.title;
        calendarDay.event = dataForDate.event;
      }
      this.calendar.push(calendarDay);
      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
    }
  }

  private getStartDateForCalendar(selectedDate: Date) {
    let lastDayOfPreviousMonth = new Date(selectedDate.setDate(1));
    let startingDateOfCalendar: Date = lastDayOfPreviousMonth;
    if (startingDateOfCalendar.getDay() != 1) {
      do {
        startingDateOfCalendar = new Date(startingDateOfCalendar.setDate(startingDateOfCalendar.getDate() - 1));
      } while (startingDateOfCalendar.getDay() != 1);
    }

    return startingDateOfCalendar;
  }

  refreshPage() {
    window.location.reload();
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

  openEventForm(day: CalendarDay) {
    this.selectedDay = day;
    this.showEventForm = true;
    if (this.selectedDay) {
      const selectedDate = new Date(this.selectedDay.date);
      selectedDate.setDate(selectedDate.getDate() + 1);
      this.inputValue = selectedDate.toISOString().substring(0, 10);
    } else {
      this.inputValue = '';
    }
    this.inputValue2 = day.title || '';
    this.inputValue3 = day.event || '';
    this.inputValue4 = this.selectedDay?.description || '';
    console.log(day)
  }

  updateEventDataFromLocalStorage(date: string, title: string, event: string, description:string) {
    const entriesData: any = JSON.parse(localStorage.getItem('entries') || '{}');

    if (entriesData[date]) {
      entriesData[date].title = title;
      entriesData[date].event = event;
      entriesData[date].description = description;
    }

    localStorage.setItem('entries', JSON.stringify(entriesData));
    this.showEventForm = false;
  }

  saveEvent() {
    if (this.selectedDay) {
      this.selectedDay.title = this.inputValue2;
      this.selectedDay.event = this.inputValue3;
      this.selectedDay.description = this.inputValue4;

      const entriesData: any[] = JSON.parse(localStorage.getItem('entries') || '[]');
      const existingDataIndex = entriesData.findIndex((data: any) => {
        return this.selectedDay && data.date instanceof Date && data.date.getTime() === this.selectedDay.date?.getTime();
      });
      if (existingDataIndex !== -1) {
        entriesData[existingDataIndex] = {
          date: this.selectedDay?.date,
          title: this.selectedDay?.title,
          event: this.selectedDay?.event,
          description: this.selectedDay?.description
        };
      } else {
        entriesData.push({
          date: this.selectedDay?.date,
          title: this.selectedDay?.title,
          event: this.selectedDay?.event,
          description: this.selectedDay?.description
        });
      }
      localStorage.setItem('entries', JSON.stringify(entriesData));

      const previousDataIndex = entriesData.findIndex((data: any) => {
        return this.selectedDay && data.date instanceof Date && data.date.getTime() === this.selectedDay.date?.getTime() && data.title && data.event && data.description;
      });
      if (previousDataIndex !== -1) {
        entriesData.splice(previousDataIndex, 1);
      }

      this.inputValue = '';
      this.inputValue2 = '';
      this.inputValue3 = '';
      this.inputValue4 = '';
      this.showEventForm = false;
    }
  }

  deleteEvent(date: string) {

    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - 1);
    const previousDate = currentDate.toISOString().substring(0, 10);

    const entriesData: any[] = JSON.parse(localStorage.getItem('entries') || '[]');

    const existingDataIndex = entriesData.findIndex((data: any) => {
      const storedDate = data.date.substring(0, 10);
      return storedDate === previousDate;
    });

    if (existingDataIndex !== -1) {
      entriesData.splice(existingDataIndex, 1);
      localStorage.setItem('entries', JSON.stringify(entriesData));

      const updatedEntriesData = JSON.parse(localStorage.getItem('entries') || '[]');
      const isDeleted = updatedEntriesData.findIndex((data: any) => {
        const storedDate = data.date.substring(0, 10);
        return storedDate === previousDate;
      }) === -1;

      if (isDeleted) {
        console.log(`Событие с датой ${previousDate} успешно удалено из localStorage.`);
      } else {
        console.log(`Не удалось удалить событие с датой ${previousDate} из localStorage.`);
      }
    } else {
      console.log(`Событие с датой ${previousDate} не найдено в localStorage.`);
    }
  }

  searchEvents(searchText: string) {
    const entriesData: any[] = JSON.parse(localStorage.getItem('entries') || '[]');

    const searchResults = entriesData.filter((data: any) => {
      return (
        data.title.includes(searchText) ||
        data.event.includes(searchText) ||
        data.date.includes(searchText)
      );
    });

    const valuesOnly = searchResults.map((data: any) => ({
      title: data.title,
      event: data.event,
      date: data.date
    }));

    alert(`Результаты поиска: ${JSON.stringify(valuesOnly)}`);
  }
}

