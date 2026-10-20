# Restauración del Comparador Clásico de 2 Fotos (1994 vs 2026) en Capítulo VIII

Plan para revertir los cambios recientes del Comparador interactivo en el Capítulo VIII («32 Años de Trayectoria»), restaurando el diseño clásico de 2 fotografías de alto contraste histórico (Lexfer bebé 1994 vs Lexfer graduación universidad 2026) con un deslizador único ultrasensible y fluido.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Decisión confirmada por el usuario en Fase 1**:
> - **Modo seleccionado**: Restaurar al comparador clásico de 2 fotos (`Lexfer1_bebecito2.jpg` de 1994 vs `Lexfer17_Graduacion_Universidad.jpeg` de 2026).
> - Se retira la fotografía intermedia de bachiller (`Lexfer18_Graduacion_Bachiller.jpg`) del comparador para devolver la experiencia de contraste directo, limpia y sin sobrecarga de múltiples controles o divisores simultáneos. *(Nota: la foto de bachiller continúa disponible en su respectivo capítulo/galería biográfica).*

---

### 1. Overview & Core Concept

- **Qué hace**: Proporciona una experiencia de comparación visual limpia y cinematográfica de antes y después («Antes: 1994» y «Ahora: 2026»). El usuario interactúa mediante un único control deslizante dorado táctil o con ratón, revelando la transformación de 32 años de trayectoria.
- **Audiencia & Propósito**: Familiares, amigos y homenajeados que visitan la biografía conmemorativa; busca conmover a través del impacto visual directo entre el inicio de la vida y el presente profesional.
- **Valor clave**: Máxima simplicidad de uso, sin confusión de modos múltiples ni interferencia entre dos barras de división superpuestas.

---

### 2. User Experience & Visual Design

- **Flujo de interacción**:
  1. Al llegar al Capítulo VIII, el usuario observa una sola tarjeta de comparación en proporción vertical con la foto actual (2026) de fondo y la foto de bebé (1994) superpuesta hasta el 50%.
  2. Una línea dorada vertical con un dial circular centrado indica el punto de separación exacto con sus etiquetas: `1994 • Inicios` (izquierda) y `2026 • 32 Años` (derecha).
  3. Al arrastrar con el dedo en móvil o con el ratón en escritorio (o usando la barra de rango inferior), la cortina se desliza de forma instantánea de 0% a 100% sin trabarse ni perder el puntero.
  4. Botones rápidos opcionales para alternar visualización directa («Ver 1994 completo» o «Ver 2026 completo») y botón de centrado rápido al 50%.

- **Identidad visual**:
  - **Paleta**: Canvas negro carbón (`#020617` / `#050505`) con marcos sutiles en ámbar/oro (`border-amber-500/30`), sombras profundas y detalles en tipografía clara de alto contraste.
  - **Tipografía**: Títulos con tipografía serif emotiva y moderna (`font-serif`), con números tabulares para los porcentajes del deslizador (`font-mono tabular-nums`).
  - **Divisor**: Línea luminosa dorada con gradiente cálido (`from-amber-300 via-amber-400 to-yellow-500`) y botón circular con icono horizontal.

---

### 3. Key Product Decisions & Trade-Offs

- **Retorno al Comparador Bipolar (2 Fotos)**:
  - *Enfoque elegido*: Eliminar la tercera capa intermedia (`compareOverlayMid`) y el segundo deslizador (`compareHandle2` y `rangeSlider2`).
  - *Por qué*: El comparador clásico de 2 fotos ofrece el mayor impacto narrativo de «Antes y Ahora» con 100% de confiabilidad táctil en cualquier dispositivo móvil o pantalla táctil sin conflictos de colisión entre dos manijas.
  - *Alternativa descartada*: Mantener 3 etapas en pestañas separadas; se descartó porque el usuario confirmó expresamente regresar a la versión clásica de 2 fotos.

- **Rastreo Global de Eventos (`PointerEvents` con `window`)**:
  - *Enfoque elegido*: Mantener la arquitectura de eventos robusta en `window` para que el usuario no pierda el arrastre si su dedo o cursor sale ligeramente del contenedor.
  - *Por qué*: Garantiza cero atascos y respuesta inmediata tanto en iOS Safari, Android Chrome y ratón de escritorio.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

```
┌──────────────────────────────────────────────────────────────┐
│                  Capítulo VIII: Comparador                   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ #compareWrapper (Contenedor interactivo cursor-ew)     │  │
│  │                                                        │  │
│  │  [Capa Fondo Base]:                                    │  │
│  │  Lexfer17_Graduacion_Universidad.jpeg (2026)           │  │
│  │                                                        │  │
│  │  [Capa Superpuesta (clip-path: polygon)]:              │  │
│  │  Lexfer1_bebecito2.jpg (1994)                          │  │
│  │                                                        │  │
│  │  [Divisor Central Dorado]:                             │  │
│  │  #compareHandle (50% default, arrastrable 0-100%)      │  │
│  │                                                        │  │
│  │  [Badges Flotantes]:                                   │  │
│  │  «1994 • Inicios» (izq)    «2026 • 32 Años» (der)      │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Control Deslizante de Rango Sincronizado:              │  │
│  │ [========🔘=============] 50%                          │  │
│  │ Accesos Rápidos: [Ver 1994] [Centrar (50%)] [Ver 2026] │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

#### Modificaciones concretas en el código:
1. **`index.html`**:
   - Reemplazar el bloque del selector de 5 modos y los controles deslizantes dobles por el markup limpio de 2 fotos.
   - Retirar `#compareOverlayMid` y `#compareHandle2`.
   - Mantener `#compareImgHoy` (2026), `#compareOverlay` con `#compareOverlayImg` (1994) y `#compareHandle`.
   - Simplificar el panel inferior a un solo deslizador intuitivo con indicador de porcentaje y accesos rápidos de vista.

2. **`js/main.js`**:
   - Simplificar la lógica del comparador eliminando los estados de `compareMode === 'tri'` y cálculos de doble corte.
   - Usar un único valor de estado `sliderPos = 50`.
   - Unificar la función `setSliderPosition(pos)` aplicando `clip-path: polygon(0% 0%, ${pos}% 0%, ${pos}% 100%, 0% 100%)` a `#compareOverlay`.
   - Vincular eventos de ratón, gestos táctiles y el control de rango deslizante único.
