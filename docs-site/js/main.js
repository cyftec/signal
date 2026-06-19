// Main JavaScript - Navigation, TOC, copy-to-clipboard

document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initCopyToClipboard();
  initTableOfContents();
  initBackToTop();
  initSmoothScroll();
  setActiveNavLink();
});

// Mobile menu
function initMobileMenu() {
  const menuButton = document.querySelector('.menu-button');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  
  if (!menuButton || !mobileNav) return;
  
  menuButton.addEventListener('click', () => {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  
  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
  
  // Close on link click
  const mobileNavLinks = mobileNav.querySelectorAll('a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Copy to clipboard
function initCopyToClipboard() {
  const copyButtons = document.querySelectorAll('.code-block-copy');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const codeBlock = button.parentElement.querySelector('code');
      if (!codeBlock) return;
      
      const text = codeBlock.textContent;
      
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
          button.textContent = 'Copy';
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
          document.execCommand('copy');
          button.textContent = 'Copied!';
          button.classList.add('copied');
          
          setTimeout(() => {
            button.textContent = 'Copy';
            button.classList.remove('copied');
          }, 2000);
        } catch (err) {
          button.textContent = 'Failed';
          setTimeout(() => {
            button.textContent = 'Copy';
          }, 2000);
        }
        
        document.body.removeChild(textArea);
      }
    });
  });
}

// Table of contents
function initTableOfContents() {
  const headings = document.querySelectorAll('.content h2, .content h3, .content h4');
  const tocContainer = document.querySelector('.toc-list');
  const mobileTocToggle = document.querySelector('.mobile-toc-toggle');
  const mobileToc = document.querySelector('.mobile-toc');
  const mobileTocButton = document.querySelector('.mobile-toc-button');
  
  if (!tocContainer || headings.length === 0) return;
  
  // Generate TOC
  let currentLevel = 2;
  let currentList = tocContainer;
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    const id = heading.id || `heading-${index}`;
    
    if (!heading.id) {
      heading.id = id;
    }
    
    const listItem = document.createElement('li');
    listItem.className = 'toc-item';
    
    const link = document.createElement('a');
    link.href = `#${id}`;
    link.textContent = heading.textContent;
    link.className = 'toc-link';
    link.dataset.level = level;
    
    listItem.appendChild(link);
    
    // Handle nesting
    if (level > currentLevel) {
      const sublist = document.createElement('ul');
      sublist.className = 'toc-sublist';
      currentList.lastElementChild?.appendChild(sublist);
      currentList = sublist;
    } else if (level < currentLevel) {
      // Go back up the hierarchy
      const levelDiff = currentLevel - level;
      for (let i = 0; i < levelDiff; i++) {
        currentList = currentList.parentElement?.parentElement || tocContainer;
      }
    }
    
    currentList.appendChild(listItem);
    currentLevel = level;
  });
  
  // Highlight active section on scroll
  const tocLinks = tocContainer.querySelectorAll('.toc-link');
  
  function updateActiveTocLink() {
    const scrollPosition = window.scrollY + 100;
    
    let activeHeading = null;
    headings.forEach(heading => {
      const headingTop = heading.offsetTop;
      if (headingTop <= scrollPosition) {
        activeHeading = heading;
      }
    });
    
    tocLinks.forEach(link => {
      link.classList.remove('active');
      if (activeHeading && link.getAttribute('href') === `#${activeHeading.id}`) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveTocLink);
  updateActiveTocLink();
  
  // Mobile TOC toggle
  if (mobileTocToggle && mobileToc && mobileTocButton) {
    mobileTocButton.addEventListener('click', () => {
      mobileToc.classList.toggle('open');
      mobileTocButton.classList.toggle('open');
    });
  }
}

// Back to top button
function initBackToTop() {
  const backToTop = document.querySelector('.back-to-top');
  
  if (!backToTop) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Set active nav link based on current page
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.header-nav a, .mobile-nav-links a');
  
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else if (currentPath.startsWith(linkPath) && linkPath !== '/') {
      // For section pages
      link.classList.add('active');
    }
  });
}

// Add copy buttons to code blocks that don't have them
function addCopyButtonsToCodeBlocks() {
  const codeBlocks = document.querySelectorAll('pre:not(.code-block pre)');
  
  codeBlocks.forEach(pre => {
    if (!pre.querySelector('.code-block-copy')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block';
      
      const copyButton = document.createElement('button');
      copyButton.className = 'code-block-copy';
      copyButton.textContent = 'Copy';
      copyButton.setAttribute('aria-label', 'Copy code to clipboard');
      
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      wrapper.insertBefore(copyButton, pre);
    }
  });
}

// Call this after page load
addCopyButtonsToCodeBlocks();
