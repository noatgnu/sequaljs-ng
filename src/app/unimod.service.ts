import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

export interface UnimodSpecificity {
  site: string;
  position: string;
  classification?: string;
  hidden?: boolean;
  neutralLoss?: Array<{
    mass: number;
    composition?: string;
    flag?: boolean;
  }>;
  group?: string;
  notes?: string;
}

export interface UnimodModification {
  id: string;           // UNIMOD:21
  numericId: string;    // 21
  name: string;         // Phospho
  description?: string; // Phosphorylation...
  deltaMonoMass?: number;
  deltaAvgMass?: number;
  composition?: string;
  approved?: boolean;
  datePosted?: string;
  dateModified?: string;
  specificities: UnimodSpecificity[];
  comment?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UnimodService {
  private unimodMap = new Map<string, UnimodModification>();
  private loadingStatus = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingStatus.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Load and parse Unimod OBO file
   */
  loadUnimodDatabase(url: string = 'unimod.obo'): Observable<Map<string, UnimodModification>> {
    this.loadingStatus.next(true);

    return this.http.get(url, { responseType: 'text' }).pipe(
      map(content => this.parseOboFile(content)),
      tap(() => this.loadingStatus.next(false)),
      catchError(err => {
        console.error('Error loading Unimod database:', err);
        this.loadingStatus.next(false);
        return of(new Map<string, UnimodModification>());
      })
    );
  }

  /**
   * Parse OBO file content and build unimod map
   */
  private parseOboFile(content: string): Map<string, UnimodModification> {
    console.log(content)
    this.unimodMap.clear();

    // Split the file by term sections
    const terms = content.split('[Term]').slice(1);
    console.log(terms.length)
    for (const term of terms) {
      if (!term.trim()) continue;

      const entry = this.parseTerm(term);
      if (entry && entry.numericId) {
        this.unimodMap.set(entry.numericId, entry);
      }
    }

    return this.unimodMap;
  }

  /**
   * Parse a single term section
   */
  private parseTerm(section: string): UnimodModification | null {
    const lines = section.split('\n').filter(line => line.trim());
    const entry: Partial<UnimodModification> = {
      specificities: []
    };

    // Track specificities by group number
    const specificityGroups = new Map<string, Partial<UnimodSpecificity>>();

    for (const line of lines) {
      if (line.startsWith('id:')) {
        entry.id = line.substring(3).trim();
        entry.numericId = entry.id.replace('UNIMOD:', '');
      }
      else if (line.startsWith('name:')) {
        entry.name = line.substring(5).trim();
      }
      else if (line.startsWith('def:')) {
        const match = line.match(/def: "([^"]+)"/);
        if (match) entry.description = match[1];
      }
      else if (line.startsWith('comment:')) {
        entry.comment = line.substring(8).trim();
      }
      else if (line.startsWith('xref:')) {
        const xrefLine = line.substring(5).trim();

        // Extract delta masses
        if (xrefLine.startsWith('delta_mono_mass')) {
          const match = xrefLine.match(/delta_mono_mass "([^"]+)"/);
          if (match) entry.deltaMonoMass = parseFloat(match[1]);
        }
        else if (xrefLine.startsWith('delta_avge_mass')) {
          const match = xrefLine.match(/delta_avge_mass "([^"]+)"/);
          if (match) entry.deltaAvgMass = parseFloat(match[1]);
        }
        else if (xrefLine.startsWith('delta_composition')) {
          const match = xrefLine.match(/delta_composition "([^"]+)"/);
          if (match) entry.composition = match[1];
        }
        else if (xrefLine.startsWith('approved')) {
          const match = xrefLine.match(/approved "([^"]+)"/);
          if (match) entry.approved = match[1] === '1';
        }
        else if (xrefLine.startsWith('date_time_posted')) {
          const match = xrefLine.match(/date_time_posted "([^"]+)"/);
          if (match) entry.datePosted = match[1];
        }
        else if (xrefLine.startsWith('date_time_modified')) {
          const match = xrefLine.match(/date_time_modified "([^"]+)"/);
          if (match) entry.dateModified = match[1];
        }
        // Handle specificity entries
        else if (xrefLine.match(/spec_(\d+)_/)) {
          const specMatch = xrefLine.match(/spec_(\d+)_(.+)/);
          if (specMatch) {
            const groupNum = specMatch[1];
            const key = specMatch[2].split(' ')[0];
            const value = xrefLine.includes('"')
              ? xrefLine.match(/"([^"]+)"/)?.[1]
              : xrefLine.split(' ').slice(1).join(' ');

            if (!specificityGroups.has(groupNum)) {
              specificityGroups.set(groupNum, {});
            }

            const specGroup = specificityGroups.get(groupNum)!;

            if (key === 'site') {
              if (!specGroup.site) {
                specGroup.site = ''
              };
              specGroup.site += value;
            } else if (key === 'position') {
              specGroup.position = value;
            } else if (key === 'classification') {
              specGroup.classification = value;
            } else if (key === 'hidden') {
              specGroup.hidden = value === '1';
            } else if (key === 'misc_notes') {
              specGroup.notes = value;
            } else if (key === 'group') {
              specGroup.group = value;
            } else if (key.includes('neutral_loss') && key.includes('mono_mass')) {
              if (!specGroup.neutralLoss) specGroup.neutralLoss = [];
              const nlNumber = key.split('_')[2];
              const nlMass = parseFloat(value || '0');

              // Find or create the neutral loss entry
              let nlEntry = specGroup.neutralLoss.find(nl => nl.mass === nlMass);
              if (!nlEntry) {
                nlEntry = { mass: nlMass };
                specGroup.neutralLoss.push(nlEntry);
              }
            }
          }
        }
      }
    }

    // Convert specificity groups to array
    specificityGroups.forEach((spec) => {
      if (spec.site) {
        entry.specificities!.push(spec as UnimodSpecificity);
      }
    });

    return entry as UnimodModification;
  }

  /**
   * Get modification by accession ID
   */
  getModification(id: string): UnimodModification | undefined {
    return this.unimodMap.get(id);
  }

  /**
   * Get all modifications
   */
  getAllModifications(): Map<string, UnimodModification> {
    return new Map(this.unimodMap);
  }

  /**
   * Find modifications by name (case-insensitive partial match)
   */
  findModificationsByName(name: string): UnimodModification[] {
    const results: UnimodModification[] = [];
    const searchTerm = name.toLowerCase();

    this.unimodMap.forEach(mod => {
      if (mod.name.toLowerCase().includes(searchTerm)) {
        results.push(mod);
      }
    });

    return results;
  }

  /**
   * Find modifications by ID (exact match)
   */
  findModificationsById(id: string): UnimodModification[] {
    const results: UnimodModification[] = [];

    this.unimodMap.forEach(mod => {
      if (mod.id === id) {
        results.push(mod);
      }
    });

    return results;
  }

  findModificationByNameExact(name: string): UnimodModification | undefined {
    const searchTerm = name.toLowerCase();
    for (const mod of this.unimodMap.values()) {
      if (mod.name.toLowerCase() === searchTerm) {
        return mod;
      }
    }
    return undefined;
  }
  /**
   * Search modifications by amino acid specificity
   */
  findModificationsBySite(site: string): UnimodModification[] {
    const results: UnimodModification[] = [];

    this.unimodMap.forEach(mod => {
      if (mod.specificities.some(spec => spec.site === site)) {
        results.push(mod);
      }
    });

    return results;
  }

  /**
   * Search modifications by delta mass within tolerance
   */
  findModificationsByMass(mass: number, tolerance: number = 0.01): UnimodModification[] {
    const results: UnimodModification[] = [];

    this.unimodMap.forEach(mod => {
      if (mod.deltaMonoMass !== undefined &&
        Math.abs(mod.deltaMonoMass - mass) <= tolerance) {
        results.push(mod);
      }
    });

    return results.sort((a, b) => {
      const distA = Math.abs((a.deltaMonoMass || 0) - mass);
      const distB = Math.abs((b.deltaMonoMass || 0) - mass);
      return distA - distB;
    });
  }
}
