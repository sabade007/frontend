import { OnDestroy, OnInit } from '@angular/core';
import { Link } from 'ngx-linkifyjs';
import { LinkPreview } from '../../interfaces/linkpreview.interface';
import { MatLinkPreviewService } from '../../service/mat-link-preview.service';
export declare class MatLinkPreviewComponent implements OnInit, OnDestroy {
    linkPreviewService: MatLinkPreviewService;
    link: Link;
    linkPreview: LinkPreview;
    color: string;
    showLoadingsProgress: boolean;
    loaded: boolean;
    hasError: boolean;
    private _subscription;
    constructor(linkPreviewService: MatLinkPreviewService);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
