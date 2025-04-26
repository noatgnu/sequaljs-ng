import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

export interface XLModTypedef {
  id: string;
  name: string;
  isTransitive?: boolean;
  definition?: string;
}

export interface XLModRelationship {
  type: string;
  targetId: string;
}

export interface XLModXref {
  database: string;
  identifier: string;
  description?: string;
}

export interface XLModEntity {
  id: string;
  name: string;
  definition?: string;
  comment?: string;
  synonyms?: string[];
  xrefs?: XLModXref[];
  relationships?: XLModRelationship[];
  obsolete?: boolean;

  monoisotopicMass?: number;
  averageMass?: number;
  formula?: string;
  spacerLength?: number;
  reactiveGroups?: string[];
  category?: string;

  isAttribute?: boolean;
  isCrosslinker?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class XLModService {
  private xlmodMap = new Map<string, XLModEntity>();
  private typedefMap = new Map<string, XLModTypedef>();
  private loadingStatus = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingStatus.asObservable();

  constructor(private http: HttpClient) {}

  loadXLModDatabase(url: string = 'https://raw.githubusercontent.com/HUPO-PSI/mzIdentML/master/cv/XLMOD.obo'): Observable<Map<string, XLModEntity>> {
    this.loadingStatus.next(true);

    return this.http.get(url, { responseType: 'text' }).pipe(
      map(content => this.parseOboFile(content)),
      tap(() => this.loadingStatus.next(false)),
      catchError(err => {
        console.error('Error loading XLMOD database:', err);
        this.loadingStatus.next(false);
        return of(new Map<string, XLModEntity>());
      })
    );
  }

  private parseOboFile(content: string): Map<string, XLModEntity> {
    this.xlmodMap.clear();
    this.typedefMap.clear();

    const typedefSections = content.split('[Typedef]').slice(1);
    const termSections = content.split('[Term]').slice(1);

    for (const section of typedefSections) {
      if (!section.trim()) continue;
      const typedef = this.parseTypedef(section);
      if (typedef && typedef.id) {
        this.typedefMap.set(typedef.id, typedef);
      }
    }

    for (const section of termSections) {
      if (!section.trim()) continue;
      const term = this.parseTerm(section);
      if (term && term.id) {
        this.xlmodMap.set(term.id, term);
      }
    }

    this.processEntityTypes();

    return this.xlmodMap;
  }

  private parseTypedef(section: string): XLModTypedef | null {
    const lines = section.split('\n').filter(line => line.trim());
    const typedef: Partial<XLModTypedef> = {};

    for (const line of lines) {
      if (line.startsWith('id:')) {
        typedef.id = line.substring(3).trim();
      }
      else if (line.startsWith('name:')) {
        typedef.name = line.substring(5).trim();
      }
      else if (line.startsWith('def:')) {
        const match = line.match(/def: "([^"]+)"/);
        if (match) typedef.definition = match[1];
      }
      else if (line.startsWith('is_transitive:')) {
        typedef.isTransitive = line.includes('true');
      }
    }

    return typedef as XLModTypedef;
  }

  private parseTerm(section: string): XLModEntity | null {
    const lines = section.split('\n').filter(line => line.trim());
    const entity: Partial<XLModEntity> = {
      synonyms: [],
      xrefs: [],
      relationships: [],
      reactiveGroups: []
    };

    for (const line of lines) {
      if (line.startsWith('id:')) {
        entity.id = line.substring(3).trim();
      }
      else if (line.startsWith('name:')) {
        entity.name = line.substring(5).trim();
      }
      else if (line.startsWith('def:')) {
        const match = line.match(/def: "([^"]+)"/);
        if (match) entity.definition = match[1];
      }
      else if (line.startsWith('comment:')) {
        entity.comment = line.substring(8).trim();
      }
      else if (line.startsWith('synonym:')) {
        const synonymMatch = line.match(/synonym: "([^"]+)"/);
        if (synonymMatch && entity.synonyms) {
          entity.synonyms.push(synonymMatch[1]);
        }
      }
      else if (line.startsWith('xref:')) {
        const xrefMatch = line.match(/xref: ([^\s:]+):([^\s"]+)( "([^"]+)")?/);
        if (xrefMatch && entity.xrefs) {
          entity.xrefs.push({
            database: xrefMatch[1],
            identifier: xrefMatch[2],
            description: xrefMatch[4] || undefined
          });

          if (xrefMatch[1] === 'DiffMono') {
            entity.monoisotopicMass = parseFloat(xrefMatch[2]);
          }
          else if (xrefMatch[1] === 'DiffAvg') {
            entity.averageMass = parseFloat(xrefMatch[2]);
          }
          else if (xrefMatch[1] === 'Formula') {
            entity.formula = xrefMatch[2];
          }
          else if (xrefMatch[1] === 'SpacerLength') {
            entity.spacerLength = parseFloat(xrefMatch[2]);
          }
        }
      }
      else if (line.startsWith('is_obsolete:')) {
        entity.obsolete = line.includes('true');
      }
      else if (line.startsWith('is_a:')) {
        const match = line.match(/is_a: ([^\s!]+)/);
        if (match && entity.relationships) {
          entity.relationships.push({
            type: 'is_a',
            targetId: match[1]
          });
        }
      }
      else if (line.startsWith('relationship:')) {
        const match = line.match(/relationship: ([^\s]+) ([^\s!]+)/);
        if (match && entity.relationships) {
          entity.relationships.push({
            type: match[1],
            targetId: match[2]
          });

          // Handle specific relationships
          if (match[1] === 'has_reactive_group' && entity.reactiveGroups) {
            entity.reactiveGroups.push(match[2]);
          }
        }
      }
    }

    return entity as XLModEntity;
  }

  private processEntityTypes() {
    this.xlmodMap.forEach(entity => {
      if (entity.relationships) {
        for (const rel of entity.relationships) {
          if (rel.type === 'is_a' && rel.targetId === 'XLMOD:00004') {
            entity.isCrosslinker = true;
          }
          if (rel.type === 'is_a' && rel.targetId === 'XLMOD:00009') {
            entity.isAttribute = true;
          }
        }
      }
    });
  }

  getCrosslinker(id: string): XLModEntity | undefined {
    const fullId = id.toUpperCase().startsWith('XLMOD:') ? id : `XLMOD:${id}`;
    return this.xlmodMap.get(fullId);
  }

  getAllCrosslinkers(): XLModEntity[] {
    const crosslinkers: XLModEntity[] = [];
    this.xlmodMap.forEach(entity => {
      if (entity.isCrosslinker && !entity.obsolete) {
        crosslinkers.push(entity);
      }
    });
    return crosslinkers;
  }

  findCrosslinkersByName(name: string): XLModEntity[] {
    const searchTerm = name.toLowerCase();
    return this.getAllCrosslinkers().filter(cl =>
      cl.name.toLowerCase().includes(searchTerm) ||
      cl.synonyms?.some(syn => syn.toLowerCase().includes(searchTerm))
    );
  }

  getTypedefs(): Map<string, XLModTypedef> {
    return new Map(this.typedefMap);
  }
}
