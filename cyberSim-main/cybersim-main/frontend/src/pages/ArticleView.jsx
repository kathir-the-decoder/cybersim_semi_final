import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ArticleView.css';

export default function ArticleView() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:5050/api/articles/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setArticle(data);
          
          // Fetch related articles
          const relatedResponse = await fetch(`http://localhost:5050/api/articles?category=${data.category}&limit=3`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            // Filter out current article and limit to 2
            const filtered = relatedData.articles.filter(a => a.slug !== slug).slice(0, 2);
            setRelatedArticles(filtered);
          }
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const getCategoryIcon = (category) => {
    const icons = {
      attack: '⚔️',
      defense: '🛡️',
      cloud: '☁️',
      tools: '🔧',
      fundamentals: '📚'
    };
    return icons[category] || '📄';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: '#0066FF',
      intermediate: '#FFA502',
      advanced: '#FF4757'
    };
    return colors[difficulty] || '#8892B0';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderMarkdown = (content) => {
    // Simple markdown rendering - in production, use a proper markdown library
    return content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
      .replace(/`([^`]*)`/gim, '<code>$1</code>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n/gim, '<br>');
  };

  if (loading) {
    return (
      <div className="article-loading">
        <div className="loading-spinner"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-not-found">
        <h2>Article Not Found</h2>
        <p>The article you're looking for doesn't exist.</p>
        <Link to="/articles" className="btn primary">Back to Articles</Link>
      </div>
    );
  }

  return (
    <div className="article-view-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/articles" className="breadcrumb-link">Articles</Link>
        <span className="breadcrumb-separator">→</span>
        <span className="breadcrumb-current">{article.title}</span>
      </div>

      {/* Article Header */}
      <div className="article-header">
        <div className="article-meta-top">
          <div className="article-category">
            <span className="category-icon">{getCategoryIcon(article.category)}</span>
            <span className="category-name">{article.category}</span>
          </div>
          <div 
            className="article-difficulty"
            style={{ color: getDifficultyColor(article.difficulty) }}
          >
            {article.difficulty}
          </div>
        </div>

        <h1 className="article-title">{article.title}</h1>
        <p className="article-description">{article.description}</p>

        <div className="article-meta">
          <div className="meta-item">
            <span className="meta-icon">👤</span>
            <span>{article.author}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span>{formatDate(article.createdAt)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span>{article.readTime} min read</span>
          </div>
        </div>

        <div className="article-tags">
          {article.tags.map((tag, index) => (
            <span key={index} className="article-tag">#{tag}</span>
          ))}
        </div>
      </div>

      {/* Article Content */}
      <div className="article-content">
        <div className="content-wrapper">
          <div className="markdown-content">
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }} />
          </div>
        </div>

        {/* Practice CTA - Only show if practiceLink exists */}
        {article.practiceLink && (
          <div className="practice-cta">
            <div className="cta-content">
              <h3>Ready to Practice?</h3>
              <p>Apply what you've learned in our interactive simulation environment</p>
              <Link to={article.practiceLink} className="btn primary large">
                <span className="practice-icon">🚀</span>
                Start Practice Lab
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="related-articles">
          <h3>Related Articles</h3>
          <div className="related-grid">
            {relatedArticles.map((related) => (
              <Link key={related._id} to={`/articles/${related.slug}`} className="related-card">
                <div className="related-category">
                  <span className="category-icon">{getCategoryIcon(related.category)}</span>
                  <span className="category-name">{related.category}</span>
                </div>
                <h4>{related.title}</h4>
                <div className="related-meta">
                  <span style={{ color: getDifficultyColor(related.difficulty) }}>
                    {related.difficulty}
                  </span>
                  <span>{related.readTime} min read</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}