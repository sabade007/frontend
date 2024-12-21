import { Link } from 'ngx-linkifyjs';
import { MatLinkPreviewService } from '../../service/mat-link-preview.service';
export declare class MatLinkPreviewContainerComponent {
    linkPreviewService: MatLinkPreviewService;
    color: string;
    multiple: boolean;
    showLoadingsProgress: boolean;
    constructor(linkPreviewService: MatLinkPreviewService);
    trackLinks(index: number, link: Link): string;
}
