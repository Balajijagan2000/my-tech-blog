/**
 * Calculates the reading time of a text in minutes.
 * Assumes an average reading speed of 200 words per minute.
 */
export function getReadingTime(text: string | undefined): string {
	if (!text) return '1 min read';
	
	const wordsPerMinute = 200;
	
	// Clean markdown/HTML syntax to get a more accurate word count
	const cleanText = text
		.replace(/```[\s\S]*?```/g, '') // Remove code blocks
		.replace(/<[^>]*>/g, '') // Remove HTML tags
		.replace(/!\[[\s\S]*?\]\([\s\S]*?\)/g, '') // Remove images
		.replace(/\[([\s\S]*?)\]\([\s\S]*?\)/g, '$1') // Remove link formatting but keep link text
		.replace(/#+\s+/g, '') // Remove headers syntax
		.replace(/[*_~`\-+>]/g, ''); // Remove other markdown styling characters

	const words = cleanText.trim().split(/\s+/).filter(Boolean).length;
	const minutes = Math.ceil(words / wordsPerMinute);
	
	return `${minutes} min read`;
}
