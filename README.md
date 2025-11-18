# SequalJS-ng

Interactive Angular demonstration site for [SequalJS](https://github.com/noatgnu/sequaljs), a TypeScript library for parsing and manipulating ProForma peptide/protein sequence notation.

## About

This Angular application provides an interactive interface for exploring and demonstrating the capabilities of the SequalJS library, including:

- **Live ProForma Parser**: Real-time parsing and visualization of protein/peptide sequences with modifications
- **ProForma 2.0 & 2.1 Support**: Full compliance with both ProForma 2.0 and ProForma 2.1 specifications
- **Interactive Examples**: Pre-loaded example sequences showcasing various ProForma features
- **Modification Visualization**: Visual representation of modifications, cross-links, branches, and ambiguities
- **Ontology Integration**: Interactive display of UniMod, PSI-MOD, GNO, XLMOD, and RESID entries
- **Glycan Visualization**: Graphical representations of glycans using GlyGen database

## Features

### ProForma 2.0 Compliance
- Base-ProForma features (amino acid sequences, modifications, terminal modifications)
- Level 2-ProForma extensions (unusual amino acids, ambiguities, joint representation)
- Top-Down extensions (RESID ontology, chemical formulas)
- Cross-Linking extensions (XL-MOD ontology)
- Glycan extensions (GNO ontology, glycan composition)
- Spectral support (charge states, chimeric spectra, global modifications)

### ProForma 2.1 Extensions
- Charged formulas (Section 11.1)
- Ion notation for fragment ions (Section 11.6)
- Placement controls: Position, Limit, CoMKP, CoMUP (Section 11.2)
- Named entities: peptidoform, peptidoform ion, compound ion (Section 8.2)
- Custom monosaccharides in glycan notation (Section 10.2)
- Terminal-specific global modifications (Section 11.3.2)

## Architecture

- **Angular**: 20.3.x
- **Angular Material**: 20.2.x
- **SequalJS**: 1.1.0
- **TypeScript**: 5.9.x

## Development

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

To start a local development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you modify source files.

### Building

To build the project for production:

```bash
ng build
```

Build artifacts will be stored in the `dist/` directory.

### Running Tests

To execute unit tests:

```bash
ng test
```

## Project Structure

```
src/
├── app/
│   ├── home/                    # Landing page
│   ├── parser/                  # Main parser component
│   │   └── parser-result/       # Parsed sequence visualization
│   ├── display-mod/             # Modification display component
│   └── ...
├── assets/                      # Static assets
└── ...
```

## Contributing

This is a demonstration application for the SequalJS library. For contributions to the core parsing functionality, please visit the [SequalJS repository](https://github.com/noatgnu/sequaljs).

## Resources

- [SequalJS Library](https://github.com/noatgnu/sequaljs)
- [ProForma Specification](https://github.com/HUPO-PSI/ProForma)
- [Angular Documentation](https://angular.dev)

## License

MIT
