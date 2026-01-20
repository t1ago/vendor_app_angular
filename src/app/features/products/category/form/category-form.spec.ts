import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryForm } from '../category-form';
import { ICategoryModel } from '../interfaces/category-model';
import { ICategoryDto } from '../interfaces/category-dto';
import { CategoryService } from '../services/category-service';
import { of, Subject } from 'rxjs';
import { ISateSaveControl } from '../../../../shared/interfaces/save-control';
import { Router } from '@angular/router';

describe('CategoryForm', () => {
  let component: CategoryForm;
  let fixture: ComponentFixture<CategoryForm>;
  let CategoryServiceMock = {
    save: vi.fn().mockReturnValue(of({})),
    mapDto: vi.fn().mockReturnValue({}),
  };
  let RouterMock = {
    navigate: vi.fn().mockReturnValue(of(true)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryForm],
      providers: [
        {
          provide: CategoryService,
          useValue: CategoryServiceMock,
        },
        {
          provide: Router,
          useValue: RouterMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    // THEN
    expect(component).toBeTruthy();
    expect(component.formData);
  });

  it('should call onSaveAction', () => {
    // GIVEN
    component.model.set({
      name: 'test',
      id: null,
    });
    fixture.detectChanges();

    // WHEN
    component.onSaveAction();
    fixture.detectChanges();

    // THEN
    expect(component.saveControl().state).toEqual(ISateSaveControl.OPEN);
  });

  it('should call onCancelAction', () => {
    // WHEN
    component.onCancelAction();
    fixture.detectChanges();

    // THEN
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should not show input name error', () => {
    // GIVEN
    component.model.set({
      name: 'test',
      id: null,
    });
    fixture.detectChanges();

    // WHEN
    const nameValue = component.formName().value();

    // THEN
    expect('test').toEqual(nameValue);
  });

  it('should show input name error', () => {
    // GIVEN
    component.model.set({
      name: '',
      id: null,
    });
    fixture.detectChanges();

    // WHEN
    component.formData.name().markAsTouched();
    fixture.detectChanges();

    // THEN
    const tagSmall = fixture.nativeElement.querySelector('small');
    expect('Nome é obrigatório').toEqual(tagSmall.textContent);
  });

  // it('should loading message', () => {
  //   // GIVEN
  //   component.model.set({
  //     name: '',
  //     id: null,
  //   });
  //   fixture.detectChanges();

  //   // WHEN
  //   component.formData.name().markAsTouched();
  //   fixture.detectChanges();

  //   // THEN
  //   const tagSmall = fixture.nativeElement.querySelector('small');
  //   expect('Nome é obrigatório').toEqual(tagSmall.textContent);
  // });
});
