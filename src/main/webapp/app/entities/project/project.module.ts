import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { BugTrackerJHipsterSharedModule } from 'app/shared';
import {
  ProjectComponent,
  ProjectDetailComponent,
  ProjectUpdateComponent,
  ProjectDeletePopupComponent,
  ProjectDeleteDialogComponent,
  projectRoute,
  projectPopupRoute
} from './';

const ENTITY_STATES = [...projectRoute, ...projectPopupRoute];

@NgModule({
  imports: [BugTrackerJHipsterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ProjectComponent,
    ProjectDetailComponent,
    ProjectUpdateComponent,
    ProjectDeleteDialogComponent,
    ProjectDeletePopupComponent
  ],
  entryComponents: [ProjectComponent, ProjectUpdateComponent, ProjectDeleteDialogComponent, ProjectDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BugTrackerJHipsterProjectModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
