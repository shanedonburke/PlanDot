import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Item } from 'src/app/domain/item';
import { UserDataService } from 'src/app/services/user-data.service';

import { FavoriteButtonComponent } from './favorite-button.component';

describe('FavoriteButtonComponent', () => {
  let component: FavoriteButtonComponent;
  let fixture: ComponentFixture<FavoriteButtonComponent>;

  let item: Item;

  let userDataService: jasmine.SpyObj<UserDataService>;

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [FavoriteButtonComponent],
      providers: [{ provide: UserDataService, useValue: userDataService }],
      imports: [
        NoopAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteButtonComponent);
    component = fixture.componentInstance;
    component.item = item;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct tooltip text', () => {
    expect(component.getTooltipText()).toEqual('Favorite item');
  });

  it('should toggle favorite', () => {
    getButton().click();

    expect(item.isFavorited).withContext('should favorite item').toBeTrue();
    expect(userDataService.saveUserData)
      .withContext('should save user data')
      .toHaveBeenCalled();
    expect(component.getTooltipText())
      .withContext('should show tooltip for removing favorite')
      .toBe('Remove favorite');
  });

  function setup(): void {
    item = new Item();
    userDataService = jasmine.createSpyObj('UserDataService', ['saveUserData']);
  }

  function getButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }
});
