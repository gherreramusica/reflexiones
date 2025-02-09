'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Link from '@tiptap/extension-link'
import { useState } from 'react'

const TiptapEditor = () => {
  const [title, setTitle] = useState('')
  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic, Underline, BulletList, OrderedList, Link],
    content: '<p>Start writing...</p>',
  })

  const savePost = async () => {
    if (!editor || !title) {
      alert('Title and content are required')
      return
    }

    const content = editor.getHTML()

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      })

      if (response.ok) {
        alert('Post saved successfully!')
        setTitle('')
        editor.commands.setContent('')
      } else {
        const error = await response.json()
        console.error('Failed to save post:', error)
        alert('Error saving the post: ' + error.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to connect to the server.')
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className="p-4 mt-4 max-w-3xl mx-auto">
      {/* Campo para el título */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter post title"
        className="w-full p-2 mb-4 border rounded"
      />

      {/* Barra de Herramientas */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
        >
          <b>B</b>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
        >
          <i>I</i>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
        >
          <u>U</u>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
        >
          1. List
        </button>
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .setLink({ href: prompt('Enter a URL') || '' })
              .run()
          }
          className="p-2 rounded"
        >
          🔗
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="p-4 border rounded-md min-h-[200px] focus:outline-none"
      />

      {/* Botón para guardar */}
      <button
        onClick={savePost}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Post
      </button>
    </div>
  )
}

export default TiptapEditor
