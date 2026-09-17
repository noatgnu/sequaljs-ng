import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

export interface PSIModRelationship {
  type: string;
  target: string;
}

export interface PSIModSynonym {
  name: string;
  type: string;
  source?: string;
}

export interface PSIModXref {
  database: string;
  identifier: string;
  description?: string;
}

export interface PSIModModification {
  id: string;
  name: string;
  definition?: string;
  comment?: string;
  synonyms?: PSIModSynonym[];
  xrefs?: PSIModXref[];
  relationships?: PSIModRelationship[];
  formula?: string;
  monoisotopicMass?: number;
  averageMass?: number;
  specificity?: string[];
  origin?: string[];
  obsolete?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PSIModService {
  private psiModMap = new Map<string, PSIModModification>();
  private loadingStatus = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingStatus.asObservable();

  private modToUnimodMap = new Map<string, string>();
  private unimodToModMap = new Map<string, string>();

  private modToResidMap = new Map<string, string>();
  private residToModMap = new Map<string, string>();

  constructor(private http: HttpClient) {}

  /**
   * Load and parse PSI-MOD OBO file
   */
  loadPSIModDatabase(url: string = 'https://raw.githubusercontent.com/HUPO-PSI/psi-mod-CV/refs/heads/master/PSI-MOD.obo'): Observable<Map<string, PSIModModification>> {
    this.loadingStatus.next(true);

    return this.http.get(url, { responseType: 'text' }).pipe(
      map(content => this.parseOboFile(content)),
      tap(() => this.loadingStatus.next(false)),
      catchError(err => {
        console.error('Error loading PSI-MOD database:', err);
        this.loadingStatus.next(false);
        return of(new Map<string, PSIModModification>());
      })
    );
  }

  /**
   * Parse OBO file content and build PSI-MOD map
   */
  private parseOboFile(content: string): Map<string, PSIModModification> {
    this.psiModMap.clear();
    this.modToUnimodMap.clear();
    this.unimodToModMap.clear();

    const terms = content.split('[Term]').slice(1);

    for (const term of terms) {
      if (!term.trim()) continue;

      const entry = this.parseTerm(term);
      if (entry && entry.id) {
        this.psiModMap.set(entry.id, entry);

        if (entry.xrefs) {
          const unimodXrefs = entry.xrefs.filter(xref =>
            xref.database.toUpperCase() === 'UNIMOD');

          for (const xref of unimodXrefs) {
            this.modToUnimodMap.set(entry.id, xref.identifier);
            this.unimodToModMap.set(xref.identifier, entry.id);
          }
        }

      }
    }
    return this.psiModMap;
  }

  /**
   * Parse a single term section
   */
  private parseTerm(section: string): PSIModModification | null {
    const lines = section.split('\n').filter(line => line.trim());
    const entry: Partial<PSIModModification> = {
      synonyms: [],
      xrefs: [],
      relationships: [],
      specificity: [],
      origin: []
    };

    for (const line of lines) {
      if (line.startsWith('id:')) {
        entry.id = line.substring(3).trim();
      }
      else if (line.startsWith('name:')) {
        entry.name = line.substring(5).trim();
      }
      else if (line.startsWith('def:')) {
        const residMatch = line.match(/RESID:([A-Z]{2}\d+)/i);

        if (residMatch) {
          const residId = residMatch[1]
          if (entry.id) {
            this.modToResidMap.set(entry.id, residId);
            this.residToModMap.set(residId, entry.id);
          }

        }
        const match = line.match(/def: "([^"]+)"/);
        if (match) entry.definition = match[1];
      }
      else if (line.startsWith('comment:')) {
        entry.comment = line.substring(8).trim();
      }
      else if (line.startsWith('synonym:')) {
        const synonymMatch = line.match(/synonym: "([^"]+)" ([A-Za-z]+)/);
        if (synonymMatch) {
          const sourcesMatch = line.match(/\[(.*)\]/);
          entry.synonyms?.push({
            name: synonymMatch[1],
            type: synonymMatch[2],
            source: sourcesMatch ? sourcesMatch[1] : undefined
          });
        }
      }
      else if (line.startsWith('xref:')) {
        const xrefMatch = line.match(/xref: ([^ ]+):([^ "]+)( "([^"]+)")?/);
        if (xrefMatch) {
          entry.xrefs?.push({
            database: xrefMatch[1],
            identifier: xrefMatch[2],
            description: xrefMatch[4] || undefined
          });

          if (xrefMatch[1] === 'DiffMono') {
            entry.monoisotopicMass = parseFloat(xrefMatch[2]);
          }
          else if (xrefMatch[1] === 'DiffAvg') {
            entry.averageMass = parseFloat(xrefMatch[2]);
          }
          else if (xrefMatch[1] === 'Formula') {
            entry.formula = xrefMatch[2];
          }
          else if (xrefMatch[1] === 'TermSpec') {
            entry.specificity?.push(xrefMatch[2]);
          }
          else if (xrefMatch[1] === 'Origin') {
            entry.origin?.push(xrefMatch[2]);
          }
        }
      }
      else if (line.startsWith('is_a:')) {
        const match = line.match(/is_a: ([^ ]+)/);
        if (match && entry.relationships) {
          entry.relationships.push({
            type: 'is_a',
            target: match[1]
          });
        }
      }
      else if (line.startsWith('relationship:')) {
        const match = line.match(/relationship: ([^ ]+) ([^ ]+)/);
        if (match && entry.relationships) {
          entry.relationships.push({
            type: match[1],
            target: match[2]
          });
        }
      }
      else if (line.startsWith('is_obsolete:')) {
        entry.obsolete = line.includes('true');
      }
    }

    return entry as PSIModModification;
  }

  /**
   * Get modification by PSI-MOD ID
   */
  getModification(id: string): PSIModModification | undefined {
    return this.psiModMap.get(id);
  }

  /**
   * Get all modifications
   */
  getAllModifications(): Map<string, PSIModModification> {
    return new Map(this.psiModMap);
  }

  /**
   * Find modifications by name (case-insensitive partial match)
   */
  findModificationsByName(name: string): PSIModModification[] {
    const results: PSIModModification[] = [];
    const searchTerm = name.toLowerCase();

    this.psiModMap.forEach(mod => {
      if (mod.name.toLowerCase().includes(searchTerm)) {
        results.push(mod);
      }
    });

    return results;
  }

  findModificationsByNameExact(name: string): PSIModModification | undefined {
    const searchTerm = name.toLowerCase();
    for (const mod of this.psiModMap.values()) {
      if (mod.name.toLowerCase() === searchTerm) {
        return mod;
      }
    }
    return undefined;
  }

  /**
   * Find PSI-MOD modification by Unimod ID
   */
  findByUnimodId(unimodId: string): PSIModModification | undefined {
    const modId = this.unimodToModMap.get(unimodId);
    return modId ? this.psiModMap.get(modId) : undefined;
  }

  /**
   * Find Unimod ID by PSI-MOD ID
   */
  getUnimodId(modId: string): string | undefined {
    return this.modToUnimodMap.get(modId);
  }

  /**
   * Search modifications by mass within tolerance
   */
  findModificationsByMass(mass: number, tolerance: number = 0.01): PSIModModification[] {
    const results: PSIModModification[] = [];

    this.psiModMap.forEach(mod => {
      if (mod.monoisotopicMass !== undefined &&
        Math.abs(mod.monoisotopicMass - mass) <= tolerance) {
        results.push(mod);
      }
    });

    return results.sort((a, b) => {
      const distA = Math.abs((a.monoisotopicMass || 0) - mass);
      const distB = Math.abs((b.monoisotopicMass || 0) - mass);
      return distA - distB;
    });
  }

  /**
   * Search modifications by amino acid specificity
   */
  findModificationsBySite(site: string): PSIModModification[] {
    const results: PSIModModification[] = [];

    this.psiModMap.forEach(mod => {
      if (mod.specificity && mod.specificity.includes(site)) {
        results.push(mod);
      }
    });

    return results;
  }

  /**
   * Get a modification by RESID ID
   */
  getModificationByResid(residId: string): PSIModModification | undefined {
    const modId = this.residToModMap.get(residId);
    return modId ? this.psiModMap.get(modId) : undefined;
  }

  /**
   * Get RESID ID for a PSI-MOD modification
   */
  getResidId(modId: string): string | undefined {
    return this.modToResidMap.get(modId);
  }

  /**
   * Check if a PSI-MOD modification has a RESID mapping
   */
  hasResidMapping(modId: string): boolean {
    return this.modToResidMap.has(modId);
  }

  /**
   * Get all RESID mappings
   */
  getAllResidMappings(): Map<string, string> {
    return new Map(this.modToResidMap);
  }
}
