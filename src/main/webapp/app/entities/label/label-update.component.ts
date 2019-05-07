import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ILabel, Label } from 'app/shared/model/label.model';
import { LabelService } from './label.service';
import { ITicket } from 'app/shared/model/ticket.model';
import { TicketService } from 'app/entities/ticket';

@Component({
  selector: 'jhi-label-update',
  templateUrl: './label-update.component.html'
})
export class LabelUpdateComponent implements OnInit {
  label: ILabel;
  isSaving: boolean;

  tickets: ITicket[];

  editForm = this.fb.group({
    id: [],
    label: [null, [Validators.required, Validators.minLength(3)]]
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected labelService: LabelService,
    protected ticketService: TicketService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ label }) => {
      this.updateForm(label);
      this.label = label;
    });
    this.ticketService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ITicket[]>) => mayBeOk.ok),
        map((response: HttpResponse<ITicket[]>) => response.body)
      )
      .subscribe((res: ITicket[]) => (this.tickets = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(label: ILabel) {
    this.editForm.patchValue({
      id: label.id,
      label: label.label
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const label = this.createFromForm();
    if (label.id !== undefined) {
      this.subscribeToSaveResponse(this.labelService.update(label));
    } else {
      this.subscribeToSaveResponse(this.labelService.create(label));
    }
  }

  private createFromForm(): ILabel {
    const entity = {
      ...new Label(),
      id: this.editForm.get(['id']).value,
      label: this.editForm.get(['label']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILabel>>) {
    result.subscribe((res: HttpResponse<ILabel>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackTicketById(index: number, item: ITicket) {
    return item.id;
  }

  getSelected(selectedVals: Array<any>, option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
