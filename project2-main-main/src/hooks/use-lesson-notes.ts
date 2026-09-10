import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/providers/auth-provider';

export function useLessonNotes(courseId: string, lessonId: string) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user || !courseId || !lessonId) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await supabase
          .from('lesson_notes')
          .select('content')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .eq('lesson_id', lessonId)
          .single();

        if (!cancelled && !error && data && data.content) {
          setContent(data.content);
        }
      } catch (err) {
        console.error('Failed to fetch lesson notes:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user, courseId, lessonId]);

  const save = useCallback(
    async (text: string) => {
      if (!user) return;
      setSaving(true);
      setSaved(false);

      try {
        await supabase.from('lesson_notes').upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          content: text,
        }, { onConflict: 'user_id,lesson_id' });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        console.error('Failed to save lesson notes:', err);
      } finally {
        setSaving(false);
      }
    },
    [user, courseId, lessonId]
  );

  const updateContent = useCallback((text: string) => {
    setContent(text);
    setSaved(false);
  }, []);

  return { content, loading, saving, saved, updateContent, save };
}
