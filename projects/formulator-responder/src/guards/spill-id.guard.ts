import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isValidSpillIdParam } from './spill-id-param';

export const spillIdGuard: CanActivateFn = (route) => {
  const spillId = route.paramMap.get('spillId');

  if (isValidSpillIdParam(spillId)) {
    return true;
  }

  return inject(Router).createUrlTree(['/']);
};
