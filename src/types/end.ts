/**
 * 3.7 Satzart END
 * @see http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf
 */
export interface End {
    kind?: 'END';

    /**
     * @see Zusatztext 1-4
     */
    text?: string | [string] | [string, string] | [string, string, string] | [string, string, string, string];
}
