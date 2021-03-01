import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import cloneDeep from 'lodash.clonedeep';

import { WeekLogComponent } from './week-log.component';
import { GapComponent } from '../gap/gap.component';
import { DailyTimeEntryComponent } from '../daily-time-entry/daily-time-entry.component';
import { TimeEntriesComponent } from '../time-entries/time-entries.component';
import { IssueLabelComponent } from '../issue-label/issue-label.component';

import { RedmineService } from '../redmine.service';
import { DayLog } from '../models/time-entries';
import { dayLog1, dayLog2, emptyDayLog } from '../models/time-entries.mock';
import { Injectable } from '@angular/core';

const MOCK_DAY_LOGS = [dayLog1, dayLog2, emptyDayLog];

@Injectable()
class MockRedmineService extends RedmineService {
  listDayLogs(): Observable<DayLog[]> {
    return of(cloneDeep(MOCK_DAY_LOGS));
  }
}

describe('WeekLogComponent', () => {
  let component: WeekLogComponent;
  let fixture: ComponentFixture<WeekLogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WeekLogComponent, GapComponent, DailyTimeEntryComponent, TimeEntriesComponent, IssueLabelComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientModule
      ],
      providers: [{ provide: RedmineService, useClass: MockRedmineService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate correctly total sum of logged hours and display it', () => {
    const expectedTotalSum = MOCK_DAY_LOGS.reduce((sum, val) => sum + val.hoursLogged, 0);
    expect(component.totalSum).toBe(expectedTotalSum);
    const weekLogElement: HTMLElement = fixture.nativeElement;
    const totalSumElement = weekLogElement.querySelector('.week-total-sum');
    expect(totalSumElement.textContent.trim()).toEqual(expectedTotalSum.toString());
  });

  it('should generate nonemmpty weeks', () => {
    expect(component.weeks.length).toBe(8);
  });

  it('should generate weeks that are containining current week', () => {
    expect(component.weeks[0].html5fmt).toBe(component.weekHtml5fmt);
  });

  it('should display record for each day', () => {
    const weekLogElement: HTMLElement = fixture.nativeElement;
    const dayItemElements = weekLogElement.querySelectorAll('.week-records app-gap');
    expect(dayItemElements.length).toEqual(MOCK_DAY_LOGS.length);
  });
});
