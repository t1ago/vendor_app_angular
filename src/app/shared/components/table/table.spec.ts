import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SHOW_ALWAYS } from './constants/table-constants';
import { ITableConfig } from './interfaces/table-config';
import { Table } from './table';

describe('Table', () => {
    let component: Table<any>;
    let fixture: ComponentFixture<Table<any>>;

    beforeEach(() => {
        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            imports: [Table],
        });

        fixture = TestBed.createComponent(Table<any>);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should render table titles', () => {
        // GIVEN
        const config: ITableConfig<any> = {
            hasHover: false,
            titles: [
                { name: 'Name', dataField: 'name' },
                { name: 'Age', dataField: 'age' },
            ],
            data: [],
            buttons: [],
        };

        fixture.componentRef.setInput('tableConfig', config);

        // WHEN
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const headers = compiled.querySelectorAll('th');

        // THEN
        expect(headers.length).toBe(2);
        expect(headers[0].textContent).toContain('Name');
        expect(headers[1].textContent).toContain('Age');
    });

    it('should render table data', () => {
        // GIVEN
        const config: ITableConfig<any> = {
            hasHover: false,
            titles: [{ name: 'Name', dataField: 'name' }],
            data: [{ name: 'Tiago' }],
            buttons: [],
        };

        fixture.componentRef.setInput('tableConfig', config);

        // WHEN
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const cells = compiled.querySelectorAll('td');

        // THEN
        expect(cells.length).toBe(1);
        expect(cells[0].textContent).toContain('Tiago');
    });

    it('should apply table-hover class when hasHover is true', () => {
        // GIVEN
        const config: ITableConfig<any> = {
            hasHover: true,
            titles: [],
            data: [],
            buttons: [],
        };

        fixture.componentRef.setInput('tableConfig', config);

        // WHEN
        fixture.detectChanges();

        const table = fixture.nativeElement.querySelector('table');

        // THEN
        expect(table.className).toContain('table-hover');
    });

    it('should render action column when buttons exist', () => {
        // GIVEN
        const config: ITableConfig<any> = {
            hasHover: false,
            titles: [{ name: 'Name', dataField: 'name' }],
            data: [{ name: 'Tiago' }],
            buttons: [
                {
                    name: 'Edit',
                    action: vi.fn(),
                    show: SHOW_ALWAYS,
                },
            ],
        };

        fixture.componentRef.setInput('tableConfig', config);

        // WHEN
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const headers = compiled.querySelectorAll('th');

        // THEN
        expect(headers[headers.length - 1].textContent).toContain('Ações');
    });

    it('should render buttons and trigger action on click', () => {
        // GIVEN
        const actionMock = vi.fn();

        const config: ITableConfig<any> = {
            hasHover: false,
            titles: [{ name: 'Name', dataField: 'name' }],
            data: [{ name: 'Tiago' }],
            buttons: [
                {
                    name: 'Edit',
                    action: actionMock,
                    show: SHOW_ALWAYS,
                },
            ],
        };

        fixture.componentRef.setInput('tableConfig', config);

        // WHEN
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const button = compiled.querySelector('button') as HTMLButtonElement;

        button.click();

        // THEN
        expect(button.textContent).toContain('Edit');
        expect(actionMock).toHaveBeenCalledWith({ name: 'Tiago' });
    });

    it('should not render button when show returns false', () => {
        // GIVEN
        const config: ITableConfig<any> = {
            hasHover: false,
            titles: [{ name: 'Name', dataField: 'name' }],
            data: [{ name: 'Tiago' }],
            buttons: [
                {
                    name: 'Hidden',
                    action: vi.fn(),
                    show: () => false,
                },
            ],
        };

        fixture.componentRef.setInput('tableConfig', config);

        // WHEN
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const button = compiled.querySelector('button');

        // THEN
        expect(button).toBeNull();
    });

    it('should render button icon when provided', () => {
        // GIVEN
        const config: ITableConfig<any> = {
            hasHover: false,
            titles: [{ name: 'Name', dataField: 'name' }],
            data: [{ name: 'Tiago' }],
            buttons: [
                {
                    name: 'Edit',
                    icon: 'icon.png',
                    action: vi.fn(),
                    show: SHOW_ALWAYS,
                },
            ],
        };

        fixture.componentRef.setInput('tableConfig', config);

        // WHEN
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const img = compiled.querySelector('img');

        // THEN
        expect(img).toBeTruthy();
        expect(img?.getAttribute('src')).toBe('icon.png');
    });
});
