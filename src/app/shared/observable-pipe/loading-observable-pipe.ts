import { defer, finalize, Observable } from 'rxjs';
import { IPageLoadingService } from '../components/page-loading/interfaces/page-loading-service';

export function loadingObservablePipe<T>(loader: IPageLoadingService) {
    return (source: Observable<T>) => {
        return defer(() => {
            loader.show();
            return source.pipe(
                finalize(() => loader.hide())
            );
        });
    };
}