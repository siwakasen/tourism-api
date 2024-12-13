import { Observable } from 'rxjs';
import { Admin } from '../tour_admin/admin.entity';

export interface AuthServiceClient {
  getUser: (body: { id: string }) => Observable<Admin>;
}
