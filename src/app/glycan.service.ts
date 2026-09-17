import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';

export interface GlycanEvidence {
  database: string;
  id: string;
  url: string;
}

export interface GlycanDetails {
  glytoucan: {
    glytoucan_ac: string;
    glytoucan_url: string;
  },
  mass: number;
  number_monosaccharides: number;
  wurcs: string;
  glycoct: string;
  species: Array<{
    taxid: string;
    name: string;
    annotation_category: string;
    evidence: Array<GlycanEvidence>;
    common_name: string;
    glygen_name: string;
    reference_species: string;
  }>,
  classification: Array<{
    type: {
      name: string;
    },
    subtype: {
      name: string;
    }
  }>,
  glycoprotein: Array<{
    uniprot_canonical_ac: string;
    start_pos: number;
    end_pos: number;
    residue: string;
    evidence: Array<GlycanEvidence>;
    protein_name: string;
    gene_name: string;
    tax_id: number;
    tax_name: string;
    tax_common_name: string;
  }>,
  crossref: Array<{
    id: string;
    url: string;
    database: string;
    categories: Array<string>;
  }>,
  mass_pme: number;
  tool_support: {
    gnome_glygen_oglycans: string;
    sandbox: string;
    gnome_glygen: string;
    gnome: string;
    gnome_glycotree_oglycans: string;
    pdb: string;
    gnome_glygen_nglycans: string;
    gnome_glycotree_nglycans: string;
  },
  missing_score: number;
  glycan_type: string;
  byonic: string;
  publication: Array<{
    title: string;
    journal: string;
    date: string;
    authors: string;
    evidence: Array<GlycanEvidence>;
    reference: Array<{
      id: string;
      url: string;
      type: string;
    }>
  }>,
  composition: {
    name: string;
    residue: string;
    count: number;
    cid: string;
    url: string;
  },
  composition_expanded: Array<{
    name: string;
    residue: string;
    count: number;
  }>,
  expression: Array<{
    category: string;
    evidence: Array<GlycanEvidence>;
    tissue: {
      name: string;
      namespace: string;
      id: string;
      url: string;
    };
    start_pos: number;
    end_pos: number;
    residue: string;
    uniprot_canonical_ac: string;
  }>,
  subsumption: Array<{
    related_accession: string;
    relationship: string;
  }>,
  names: Array<{
    name: string;
    domain: string;
  }>,
  section_stats: Array<{
    table_id: string;
    table_stats: Array<{
      field: string;
      count: number;
    }>;
    sort_fields: Array<string>;
  }>,
  history: Array<{
    type: string;
    description: string;
  }>
}

export interface GlycanSearchSimpleResponse {
  query: {
    query_type: string;
    term: string;
    term_category: string;
  };
  list_id: string;
  resultcount: number;
}

export interface GlycanListItem {
  glytoucan_ac: string;
  image_url: string;
  hit_score: number;
  mass: number;
  byonic?: string;
  publication?: string;
  filter_code?: string;
  score_info?: {
    contributions: Array<{
      c: string;
      w: number;
      f: number;
    }>;
    formula: string;
    variables: {
      c: string;
      w: string;
      f: string;
    };
  };
}

export interface GlycanListResponse {
  results: GlycanListItem[];
  pagination: {
    total_length: number;
    offset: number;
    limit: number;
    sort: string;
    order: string;
  };
  cache_info?: any;
  filters?: any;
  query?: any;
}

@Injectable({
  providedIn: 'root'
})
export class GlycanService {
  private baseUrl = 'https://api.glygen.org/glycan/detail/';
  private searchUrl = 'https://api.glygen.org/glycan/search/';
  private searchSimpleUrl = 'https://api.glygen.org/glycan/search_simple/';
  private listUrl = 'https://api.glygen.org/glycan/list';

  constructor(private http: HttpClient) { }

  /**
   * Get detailed information about a glycan by its GNO ID
   */
  getGlycanDetails(gnoId: string): Observable<GlycanDetails | null> {
    if (!gnoId) return of(null);

    const cleanId = gnoId.startsWith('GNO:') ? gnoId.substring(4) : gnoId;

    return this.http.get<GlycanDetails>(`${this.baseUrl}${cleanId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching glycan details:', error);
          return of(null);
        })
      );
  }

  /**
   * Check if a glycan ID exists in the GNO database
   */
  checkIfGlycanExists(gnoId: string): Observable<boolean> {
    if (!gnoId) return of(false);

    const cleanId = gnoId.startsWith('GNO:') ? gnoId.substring(4) : gnoId;

    return this.http.get<GlycanDetails>(`${this.baseUrl}${cleanId}`)
      .pipe(
        map(response => !!response),
        catchError(() => of(false))
      );
  }

  /**
   * Search glycans by name or partial ID
   */
  searchGlycans(query: string): Observable<GlycanDetails[]> {
    if (!query || query.length < 3) return of([]);

    const params = {
      query: query,
      limit: 10
    };

    return this.http.get<{results: GlycanDetails[]}>(this.searchUrl, { params })
      .pipe(
        map(response => response.results || []),
        catchError(() => of([]))
      );
  }

  /**
   * Simple search for glycans using GlyGen search_simple API
   */
  searchSimple(term: string, termCategory: string = 'any'): Observable<GlycanSearchSimpleResponse | null> {
    if (!term) return of(null);

    const body = {
      query_type: 'glycan_search_simple',
      term: term,
      term_category: termCategory
    };

    return this.http.post<GlycanSearchSimpleResponse>(this.searchSimpleUrl, body)
      .pipe(
        catchError(error => {
          console.error('Error in simple glycan search:', error);
          return of(null);
        })
      );
  }

  /**
   * Get glycan list using list_id from search_simple
   */
  getGlycanList(listId: string, offset: number = 1, limit: number = 20): Observable<GlycanListResponse | null> {
    if (!listId) return of(null);

    const query = {
      id: listId,
      offset: offset,
      sort: 'hit_score',
      limit: limit,
      order: 'desc',
      filters: [],
      columns: ['glytoucan_ac', 'image_url', 'hit_score', 'mass', 'byonic', 'publication']
    };

    const params = {
      query: JSON.stringify(query)
    };

    return this.http.get<GlycanListResponse>(this.listUrl, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching glycan list:', error);
          return of(null);
        })
      );
  }
}
