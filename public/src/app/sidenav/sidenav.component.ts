import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthenticationService, CredentialsService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  mobileQuery: MediaQueryList;

  show = true;

  // fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);
  fillerNav = [
    { name: 'Home', route: '/home', icon: 'home' },
    { name: 'Empresa', route: '/empresa', icon: 'business_center' },
    { name: 'Obligacion', route: '/obligacion', icon: 'label_important' },
    { name: 'Usuarios', route: '/users', icon: 'people' }
  ];

  fillerContent = Array.from(
    { length: 50 },
    () =>
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
  );

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authenticationService: AuthenticationService,
    private router: Router,
    private credentialsService: CredentialsService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.username : null;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  shouldRun = true;

  val(refer: string) {
    if (this.credentialsService.isAuthenticated()) {
      const super_admin = this.credentialsService.credentials.userInfo.super_admin || 0;
      if (super_admin != 1 && (refer == 'Obligacion' || refer == 'Usuarios')) {
        return (this.show = false);
      } else {
        return (this.show = true);
      }
    }
  }

  valRoute(route: string) {
    if (this.credentialsService.isAuthenticated()) {
      const super_admin = this.credentialsService.credentials.userInfo.super_admin || 0;
      if (super_admin !== 1 && (route === '/obligacion' || route === '/users')) {
        return '';
      } else {
        return route;
      }
    }
  }

  ngOnInit() {}
}
