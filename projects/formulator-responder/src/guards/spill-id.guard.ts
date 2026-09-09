import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isUuid } from '../utils/is-uuid';

export const spillIdGuard: CanActivateFn = (route) => {
  const spillId = route.paramMap.get('spillId');

  if (isUuid(spillId)) {
    return true;
  }

  return inject(Router).createUrlTree(['/']);
};
