import { Injectable } from '@angular/core';

/**
 * Service de sécurité pour sanitizer les entrées utilisateur
 * Protège contre les attaques XSS (Cross-Site Scripting)
 */
@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  /**
   * Sanitize une chaîne en échappant les caractères HTML dangereux
   * @param input - La chaîne à nettoyer
   * @returns La chaîne nettoyée
   */
  sanitizeHtml(input: string): string {
    if (!input) return '';

    const htmlEntities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };

    return input.replace(/[&<>"'`=/]/g, char => htmlEntities[char] || char);
  }

  /**
   * Vérifie si une chaîne contient du HTML potentiellement dangereux
   * @param input - La chaîne à vérifier
   * @returns true si du HTML dangereux est détecté
   */
  containsMaliciousHtml(input: string): boolean {
    if (!input) return false;

    const dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,  // onclick=, onerror=, etc.
      /<embed\b/gi,
      /<object\b/gi,
      /<link\b/gi,
      /<style\b/gi,
      /expression\s*\(/gi,
      /url\s*\(/gi
    ];

    return dangerousPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Nettoie une entrée utilisateur en supprimant les tags HTML
   * @param input - La chaîne à nettoyer
   * @returns La chaîne sans tags HTML
   */
  stripHtmlTags(input: string): string {
    if (!input) return '';
    return input.replace(/<[^>]*>/g, '');
  }

  /**
   * Valide et nettoie un titre de tâche
   * @param title - Le titre à valider
   * @returns Le titre nettoyé ou null si invalide
   */
  validateTaskTitle(title: string): string | null {
    if (!title || !title.trim()) return null;

    // Supprimer les tags HTML
    const cleaned = this.stripHtmlTags(title.trim());

    // Vérifier la longueur
    if (cleaned.length < 1 || cleaned.length > 200) return null;

    return cleaned;
  }

  /**
   * Valide et nettoie une description de tâche
   * @param description - La description à valider
   * @returns La description nettoyée
   */
  validateTaskDescription(description: string): string {
    if (!description) return '';

    // Supprimer les tags HTML
    return this.stripHtmlTags(description.trim());
  }

  /**
   * Log une tentative d'injection potentielle
   * @param input - L'entrée suspecte
   * @param context - Le contexte (ex: "task title")
   */
  logSecurityWarning(input: string, context: string): void {
    console.warn(`[SECURITY] Tentative d'injection détectée dans ${context}:`, input);
  }
}

